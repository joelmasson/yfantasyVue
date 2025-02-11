import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { gameDays } from "../utils/index";

import Axios from "axios";

import getDailyProjection from "../services/sportsData";
import { getPlayerAverages, getYahooPlayersLeague } from "../services/apiData";
import { APINHLStandings } from "../services/statsapi";

export const useStore = defineStore("main", {
  actions: {
    async getYahooLeague(game_id, league_id) {
      if (
        this.league.edit_key === undefined ||
        new Date(this.league.edit_key) < new Date()
      ) {
        await Axios.post("/api/yahoo/leagues/fetch", {
          league_keys: [game_id + ".l." + league_id],
          subresources: ["settings", "standings", "scoreboard"],
        })
          .then((response) => {
            console.log(response);
            this.league = response.data[0];
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    },
    async getYahooScoreBoard(league_key, week) {
      return await Axios.post("/api/yahoo/league/scoreboard", {
        league_keys: league_key,
        week: week,
      })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    async requestProjections() {
      let dates = gameDays(
        this.league.scoreboard.matchups[0].week_start,
        this.league.scoreboard.matchups[0].week_end,
        true
      );
      console.log(dates);
      if (this.projections[0]?.value.data === undefined) {
        let dailyProjectionPromise = dates.map((day) => {
          return getDailyProjection(day);
        });
        Promise.allSettled(dailyProjectionPromise).then((response) => {
          console.log(response);
          if (response[0].value === "Request failed with status code 403") {
            this.projections = "Out of call volume quota.";
          } else {
            this.projections = response;
          }
        });
      } else {
        return this.projections;
      }
    },
    async getTakenPlayers(league_key, start) {
      console.log(this.hasAllTakenPlayers, this.takenPlayers.length, start);
      if (!this.hasAllTakenPlayers) {
        getYahooPlayersLeague(league_key, {
          status: "T",
          start: start,
        }).then((response) => {
          console.log(response);
          let players = response.players.flatMap((player) => {
            return player.name.full;
          });
          this.takenPlayers.push(...players);
          if (response.players.length === 25) {
            this.getTakenPlayers(league_key, response.players.length);
          } else {
            this.hasAllTakenPlayers = true;
          }
        });
      } else {
        return this.takenPlayers;
      }
    },
    async getPlayersWithXGamesLeft(
      teamIds,
      league,
      teamId,
      lastGameDayPlayed,
      season
    ) {
      let matchData = {
        fantasyTeamId: [null, league + ".t." + teamId],
        position: ["Forward", "Defenseman"],
        currentTeamId: teamIds,
      };
      console.log("loading");
      getPlayerAverages(
        matchData,
        82,
        "GAME_SCORE",
        season + "020000",
        lastGameDayPlayed.gamePk,
        true
      ).then((response) => {
        this.replacements = {
          players: response.map((player) => {
            return {
              ...player,
              selected: false,
            };
          }),
        };
      });
    },
    async fetchNHLStandings(date) {
      if (this.standings.length === 0) {
        try {
          let response = await Axios.get("/api/standings/" + date);
          this.standings = response.data.standings.map((team) => {
            return {
              gamesPlayed: team.gamesPlayed,
              teamAbbrev: team.teamAbbrev,
              pointPctg: team.pointPctg,
            };
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        return this.standings;
      }
    },
    async pullNHLSchedule() {},
    async fetchWeekSchedule() {
      Axios.get("/api/schedule").then((response) => {
        this.weekSchedule = response.data.gameWeek;
      });
    },
  },
  state: () => ({
    league: useStorage("league", {}),
    projections: useStorage("projections", []),
    replacements: useStorage("replacments", {
      gameDays: 0,
      teamId: "",
      players: [],
    }),
    NHL: useStorage("NHL", {}),
    standings: useStorage("standings", {}),
    weekSchedule: useStorage("weekSchedule", []),
    takenPlayers: useStorage("takenPlayers", []),
    hasAllTakenPlayers: useStorage("hasAllTakenPlayers", false),
    // TODO save NHL Team data
  }),
  getters: {
    getLeague: (state) => () => {
      return state.league;
    },
    getLeagueKeys: (state) => () => {
      return state.league_keys;
    },
    getTeams: (state) => () => {
      return state.teams;
    },
    getCategories: (state) => (type) => {
      if (type === undefined) {
        return state.league.settings.stat_categories;
      } else {
        return state.league.settings.stat_categories.filter(
          (category) => category.position_type === type
        );
      }
    },
    getPositions: (state) => () => {
      return state.positions;
    },
    getMatch: (state) => (id) => {
      return state.league.scoreboard.matchups.filter((match) => {
        return match.teams.some((team) => {
          if (team.team_id === id) {
            return { ...match, players: [] };
          }
        });
      })[0];
    },
    getReplacements: (state) => () => {
      return state.replacements;
    },
    getTeam: (state) => (id) => {
      return state.league.standings.find((team) => {
        if (team.team_id === id) {
          return team;
        }
      });
    },
    getNHLStandings: (state) => () => {
      return state.standings;
    },
    getWeekSchedule: (state) => () => {
      return state.weekSchedule;
    },
    getProjections: (state) => () => {
      return state.projections;
    },
  },
  mutations: {
    setLeagueData(state, leagueData) {
      state.positions = leagueData.settings.roster_positions;
      state.categories = leagueData.settings.stat_categories;
      // state.modifiers = leagueData.settings.stat_modifiers
      state.teams = leagueData.teams;
      state.league = leagueData.league;
      state.league_keys = leagueData.league_keys;
    },
    setLeagueKeys(state, data) {
      state.league_keys = data;
    },
    updateReplacements(state, data) {
      state.replacements = data;
    },
    setWeekSchedule(state, data) {
      state.weekSchedule = data;
    },
  },
});
