import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { gameDays } from "../utils/index";

import Axios from "axios";

import getDailyProjection from "../services/sportsData";
import { getPlayerAverages } from "../services/apiData";
import { APINHLStandings } from "../services/statsapi";

export const useStore = defineStore("main", {
  actions: {
    async getYahooLeague(game_id, league_id) {
      console.log('yahoo')
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
      console.log("called");
      return await Axios.post("/api/yahoo/league/scoreboard", {
        league_keys: league_key,
        week: week,
      })
        .then((response) => {
          console.log(response);
          return response;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    async getProjections() {
      let dates = gameDays(
        this.league.scoreboard.matchups[0].week_start,
        this.league.scoreboard.matchups[0].week_end,
        true
      );
      if (this.projections.length === 0) {
        let dailyProjectionPromise = dates.map((day) => {
          return getDailyProjection(day);
        });
        Promise.allSettled(dailyProjectionPromise).then((response) => {
          if (response[0].value === "Request failed with status code 403") {
            this.projections = "Out of call volume quota.";
          } else {
            let days = response
              .filter((day) => {
                if (day.value.length > 0) {
                  return day;
                }
              })
              .map((day) => {
                return {
                  date: day.value[0].Day,
                  players: day.value.map((player) => {
                    return {
                      name: player.Name,
                      team: player.Team,
                      positon: player.YahooPosition,
                    };
                  }),
                };
              });
            this.projections = days;
          }
        });
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
      try {
        Axios.get('/api/standings/' + date).then((response) => {
          this.standings = response.data.standings
        });
      } catch (error) {
        console.log(error)
      }
    },
    async pullNHLSchedule() { },
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
            return match;
          }
        });
      })[0];
    },
    getReplacements: (state) => () => {
      return state.replacements;
    },
    getTeam: (state) => (id) => {
      return state.league.standings
        .find((team) => {
          if (team.team_id === id) {
            return team;
          }
        })
    },
    getNHLStandings: (state) => () => {
      return state.standings;
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
    }
  },
});
