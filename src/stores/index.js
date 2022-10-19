import { defineStore } from 'pinia'
import Axios from 'axios'

export const useStore = defineStore('main', {
    actions: {
        // getLeagueData ({ commit, getters }, payload) {
        //   const data = getters.getYahooLeague
        //   localStorage.setItem('league', state)
        // },
        async getYahooLeague(game_id, league_id) {
            if (Object.keys(this.league).length === 0) {
                await Axios.post('/api/yahoo/leagues/fetch', {
                    league_keys: [
                        game_id + '.l.' + league_id
                    ],
                    subresources: ['settings', 'standings', 'scoreboard'],
                    week: 2
                }).then((response) => {
                    this.league = response.data[0]
                }).catch((error) => {
                    console.log('error', error)
                })
            }
        },
        getStateData() {
            return localStorage.getItem('state')
        }
    },
    state: () => ( {
        settings: {},
        categories: {},
        teams: [],
        league: {},
        league_keys: [],
        userTeamId: 13
    }),
    getters: {
        getLeague: state => () => {
            return state.league
        },
        getLeagueKeys: state => () => {
            return state.league_keys
        },
        getTeams: state => () => {
            return state.teams
        },
        getCategories: state => () => {
            return state.categories
        },
        getPositions: state => () => {
            return state.positions
        },
        getMatch: state => (id) => {
            return state.league.scoreboard.matchups.filter((match) => {
                return match.teams.some((team) => {
                    if (team.team_id === id) {
                        return match
                    }
                })
            })[0]
        }
    },
    mutations: {
        setLeagueData(state, leagueData) {
            state.positions = leagueData.settings.roster_positions
            state.categories = leagueData.settings.stat_categories
            // state.modifiers = leagueData.settings.stat_modifiers
            state.teams = leagueData.teams
            state.league = leagueData.league
            state.league_keys = leagueData.league_keys
        },
        setLeagueKeys(state, data) {
            state.league_keys = data
        }
    }
})