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
                <tr v-if="actuals.length > 0">
                    <td class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        v-for="stat in actuals" :key="stat.stat_id">
                        {{ stat.value === '' ? 0 : stat.value }}
                    </td>
                </tr>
                <tr v-if="projections.length > 0">
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
import standardizeDate from '../../utils/standardizeDate'
export default {
    name: 'matchupProjectionWeek',
    setup() {
        const route = useRoute()
        const store = useStore()
        return { store, route }
    },
    props: ['settings', 'players', 'schedule', 'scoreboard'],
    computed: {
        actuals: function () {
            if (this.scoreboard === null) {
                return []
            }
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
            let stats = this.settings.map(stat => {
                if (Object.keys(this.players).length === 0 || Object.keys(this.schedule).length === 0) {
                    return { name: stat.name, value: 0 }
                }
                let value = this.players.map(player => {
                    let playerStats = player.starting.map(date => { // Loop over each day in the week
                        let match = this.schedule.filter(match => {
                            if (standardizeDate(date.date) === standardizeDate(match.gameDate)) {
                                if (match.teams.home.team.name === player.editorial_team_full_name || match.teams.away.team.name === player.editorial_team_full_name) {
                                    return match
                                }
                            }
                        }).map(match => {
                            if (match.status.detailedState === 'Final') {
                                let gameStats = player.previousGames.find(previousGame => previousGame.gamePk === match.gamePk)
                                if (gameStats !== undefined) {
                                    let statValue = YahooCategoryToAPIStat(stat.name, gameStats)
                                    if (isNaN(statValue) || statValue === undefined || statValue === null) {
                                        statValue = 0
                                    }
                                    return statValue
                                }
                                return 0
                            } else {
                                let statValue = YahooCategoryToAPIStat(stat.name, player.averages)
                                if (isNaN(statValue) || statValue === undefined) {
                                    statValue = 0
                                }

                                if (match.teams.home.team.name === player.editorial_team_full_name) {
                                    return (statValue * (1 - match.teams.away.sos))
                                } else if (match.teams.away.team.name === player.editorial_team_full_name) {
                                    return statValue * (1 - match.teams.home.sos)
                                }
                            }
                        })
                        return match.length === 0 ? [0] : match
                    })
                    let ps = playerStats.reduce((a, b) => {
                        return a + b[0]
                    }, 0)
                    return ps
                }).reduce((a, b) => a + b, 0).toFixed(2)
                return { name: stat.name, value: value }
            })
            return stats
        }
    }
}
</script>
