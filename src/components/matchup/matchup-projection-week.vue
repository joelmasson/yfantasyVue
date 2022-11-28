<template>
    <div>
        <!-- <TeamProfile :team="team" :settings="settings"></TeamProfile> -->
        <table class="min-w-full divide-y divide-gray-200" x-max="1">
            <thead>
                <tr>
                    <th scope="col"
                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        v-for="(category, i) in settings" :key="i">
                        {{ category.display_name }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        v-for="stat in actuals" :key="stat.stat_id">
                        {{ stat.value }}
                    </td>
                </tr>
                <tr>
                    <td class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        v-for="stat in projections" :key="stat.stat_id">
                        {{ stat.value }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { useStore } from '../../stores/index.js'
import { YahooCategoryToAPIStat } from '../../utils/index'
import TeamProfile from '../TeamProfile.vue'
export default {
    name: 'matchupProjectionWeek',
    setup() {
        const route = useRoute()
        const store = useStore()
        return { store, route }
    },
    data() {
        return {
            categories: []
        }
    },
    props: ['settings', 'players', 'schedule', 'scoreboard'],
    computed: {
        actuals: function () {
            return this.scoreboard.filter(matchup => {
                if (matchup.teams[0].team_id === this.route.params.team_id) {
                    return matchup
                } else if (matchup.teams[1].team_id === this.$route.params.team_id) {
                    return matchup
                }
            })[0].teams.filter(team => {
                if (team.team_id === this.$route.params.team_id) {
                    return team
                }
            }).flatMap(team => {
                return team.stats
            })
        },
        projections: function () {
            return this.settings.map(stat => {
                let value = this.players.map(player => {
                    let data = YahooCategoryToAPIStat(stat.name, player.averages)
                    if (isNaN(data) || data === undefined) {
                        data = 0
                    }
                    return player.starting.map(date => {
                        let days = this.schedule.filter(match => {
                            if (new Date(date.date).setHours(0, 0, 0, 0) === new Date(match.gameDate).setHours(0, 0, 0, 0)) {
                                if (match.teams.home.team.name === player.editorial_team_full_name || match.teams.away.team.name === player.editorial_team_full_name) {
                                    return match
                                }
                            }
                        }).map(match => {
                            if (match.teams.home.team.name === player.editorial_team_full_name) {
                                return (data * (1 - match.teams.home.sos))
                            } else if (match.teams.away.team.name === player.editorial_team_full_name) {
                                return data * (1 - match.teams.away.sos)
                            }
                        })
                        return days.length === 0 ? [0] : days
                    }).reduce((a, b) => {
                        return a + b[0]
                    }, 0)
                }).reduce((a, b) => a + b, 0).toFixed(2)
                return { name: stat.name, value: value }
            })
        }
        //   return gameDays = this.schedule.map((gameDay, gameDayIndex) => {
        //     return gameDay.date
        //   })
        //   //   let categories = this.settings.map(category => {
        //   //     let activePlayersStat = this.players.filter(activePlayer => {
        //   //       let active = activePlayer.rostered.filter(activeDay => {
        //   //         if (activeDay.date === gameDay.date) {
        //   //           if (activeDay.position !== 'BN' || activeDay.position !== 'IR+') {
        //   //             return activeDay
        //   //           }
        //   //         }
        //   //       })
        //   //       if (active.length > 0) {
        //   //         return activePlayer
        //   //       }
        //   //       return activePlayer
        //   //     }).map(player => {
        //   //       let cat = ''
        //   //       let value = null
        //   //       switch (category.name) {
        //   //         case 'Goals':
        //   //           cat = 'GOAL'
        //   //           break
        //   //         case 'Assists':
        //   //           cat = 'ASSIST'
        //   //           break
        //   //         case 'Plus/Minus':
        //   //           cat = 'PLUS_MINUS'
        //   //           break
        //   //         case 'Penalty Minutes':
        //   //           cat = 'PENALTY_FOR'
        //   //           break
        //   //         case 'Powerplay Points':
        //   //           value = player.projectedStats['5_ON_3_GOAL'] + player.projectedStats['5_ON_4_GOAL'] + player.projectedStats['5_ON_4_ASSIST'] + player.projectedStats['5_ON_4_ASSIST_2']
        //   //           break
        //   //         case 'Game-Winning Goals':
        //   //           value = 0
        //   //           break
        //   //         case 'Faceoffs Won':
        //   //           cat = 'FACEOFF_WIN'
        //   //           break
        //   //         case 'Hits':
        //   //           cat = 'HIT'
        //   //           break
        //   //         case 'Blocks':
        //   //           cat = 'BLOCKED_SHOT'
        //   //           break
        //   //         case 'Wins':
        //   //           value = 0
        //   //           break
        //   //         case 'Goals Against':
        //   //           cat = 'GOAL_ALLOWED'
        //   //           break
        //   //         case 'Goals Against Average':
        //   //           cat = 'GOALS_AGAINST_AVERAGE'
        //   //           break
        //   //         case 'Saves':
        //   //           cat = 'SAVE'
        //   //           break
        //   //         case 'Shots Against':
        //   //           value = player.projectedStats['SAVE'] + player.projectedStats['GOAL_ALLOWED']
        //   //           break
        //   //         case 'Save Percentage':
        //   //           cat = 'SAVE_PERCENTAGE'
        //   //           break
        //   //         case 'Shutouts':
        //   //           cat = 'SHUTOUT'
        //   //           break
        //   //         default:
        //   //           break
        //   //       }
        //   //       // let gamesLeft = player.games.filter(game => {
        //   //       //   if (game.score === '- v -') {
        //   //       //     return game
        //   //       //   }
        //   //       // })
        //   //       if (value === null) {
        //   //         value = player.projectedStats[cat] === undefined ? 0 : player.projectedStats[cat]
        //   //         console.log(cat, value)
        //   //       }
        //   //       if (category.name === 'Save Percentage') {
        //   //         return value
        //   //       } else {
        //   //         let sos = player.games[gameDayIndex].sos === undefined ? 0 : player.games[gameDayIndex].sos
        //   //         // console.log(value, sos)
        //   //         return value * sos
        //   //       }
        //   //     }).reduce((a, b) => a + b)
        //   //     console.log(activePlayersStat)
        //   //     // let reduce = activePlayersStat.reduce((a, b) => a + b)
        //   //     return {
        //   //       stat_id: category.stat_id,
        //   //       value: Math.round((activePlayersStat + Number.EPSILON) * 100) / 100
        //   //     }
        //   //   })
        //   //   return categories
        //   // })
        //   // // Loop over each Category
        //   //   // Loop over each GameDay
        //   //     // Loop over each Player
        //   //       activePlayer.rostered.filter(date => {
        //   //         if(date.date === gameDay.date)
        //   //       })
        //   //       if ( .!active.selected_position.includes('IR+')) {
        //   //         return active
        //   //       }
        //   //     }).map(player => {
        //   //       let cat = ''
        //   //       let value = null
        //   //       switch (category.name) {
        //   //         case 'Goals':
        //   //           cat = 'GOAL'
        //   //           break
        //   //         case 'Assists':
        //   //           cat = 'ASSIST'
        //   //           break
        //   //         case 'Plus/Minus':
        //   //           cat = 'PLUS_MINUS'
        //   //           break
        //   //         case 'Penalty Minutes':
        //   //           cat = 'PENALTY_FOR'
        //   //           break
        //   //         case 'Powerplay Points':
        //   //           value = player.projectedStats['5_ON_3_GOAL'] + player.projectedStats['5_ON_4_GOAL'] + player.projectedStats['5_ON_4_ASSIST'] + player.projectedStats['5_ON_4_ASSIST_2']
        //   //           break
        //   //         case 'Game-Winning Goals':
        //   //           value = 0
        //   //           break
        //   //         case 'Faceoffs Won':
        //   //           cat = 'FACEOFF_WIN'
        //   //           break
        //   //         case 'Hits':
        //   //           cat = 'HIT'
        //   //           break
        //   //         case 'Blocks':
        //   //           cat = 'BLOCKED_SHOT'
        //   //           break
        //   //         case 'Wins':
        //   //           value = 0
        //   //           break
        //   //         case 'Goals Against':
        //   //           cat = 'GOAL_ALLOWED'
        //   //           break
        //   //         case 'Goals Against Average':
        //   //           cat = 'GOALS_AGAINST_AVERAGE'
        //   //           break
        //   //         case 'Saves':
        //   //           cat = 'SAVE'
        //   //           break
        //   //         case 'Shots Against':
        //   //           value = player.projectedStats['SAVE'] + player.projectedStats['GOAL_ALLOWED']
        //   //           break
        //   //         case 'Save Percentage':
        //   //           cat = 'SAVE_PERCENTAGE'
        //   //           break
        //   //         case 'Shutouts':
        //   //           cat = 'SHUTOUT'
        //   //           break
        //   //         default:
        //   //           break
        //   //       }
        //   //       let gamesLeft = player.games.filter(game => {
        //   //         if (game.score === '- v -') {
        //   //           return game
        //   //         }
        //   //       })
        //   //       if (value === null) {
        //   //         value = player.projectedStats[cat] === undefined ? 0 : player.projectedStats[cat]
        //   //       }
        //   //       if (category.name === 'Save Percentage') {
        //   //         return value
        //   //       } else {
        //   //         return value * gamesLeft.length
        //   //       }
        //   //     }).reduce((a, b) => a + b)
        //   //   })
        //   //   if (category.name === 'Save Percentage' || category.name === 'Goals Against Average') {
        //   //     let goalies = this.players.filter(player => {
        //   //       if (player.eligible_positions === 'G') {
        //   //         return player
        //   //       }
        //   //     })
        //   //     let futureGoalieGames = goalies.map(player => {
        //   //       return player.games.filter(game => {
        //   //         if (game.score === '- v -') {
        //   //           return game
        //   //         }
        //   //       })
        //   //     }).length
        //   //     value = value / futureGoalieGames
        //   //     if (category.name === 'Goals Against Average') {
        //   //       value = value / goalies.length
        //   //     }
        //   //   }
        //   //   return {
        //   //     stat_id: category.stat_id,
        //   //     value: Math.round((value + Number.EPSILON) * 100) / 100

        //   //   }
        //   // })
        // }
    }
}
</script>
