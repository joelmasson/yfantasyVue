import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import Axios from 'axios'

export const useStore = defineStore('main', {
    actions: {
        async getYahooLeague(game_id, league_id) {
            if (new Date(this.league.edit_key) < new Date()) {
                await Axios.post('/api/yahoo/leagues/fetch', {
                    league_keys: [
                        game_id + '.l.' + league_id
                    ],
                    subresources: ['settings', 'standings', 'scoreboard']
                }).then((response) => {
                    console.log(response)
                    this.league = response.data[0]
                }).catch((error) => {
                    console.log('error', error)
                })
            }
        },
    },
    state: () => ( {
        league:  useStorage('league',{}),
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