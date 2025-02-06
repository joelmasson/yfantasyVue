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
                <tr>
                    <td class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        v-for="stat in projectedStats" :key="stat.stat_id">
                        {{ stat.value === '' ? 0 : stat.value }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { toRaw, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '../../stores/index.js'
import { YahooCategoryToAPIStat } from '../../utils/index'
import TeamProfile from '../TeamProfile.vue'
import standardizeDate from '../../utils/standardizeDate'
export default {
    name: 'weekProjections',
    props: ['settings', 'players', 'schedule', 'scoreboard', 'team_id'],
    setup(props) {
        const route = useRoute()
        const store = useStore()
        return {
            store, route
        }
    },
    data() {
        return {
            projections: [{ stat_id: 0, value: 0 }]
        }
    },

    computed: {
        actuals: function () {
            if (this.scoreboard === null) {
                return []
            }
            return this.scoreboard.filter(matchup => {
                if (matchup.teams[0].team_id === this.team_id) {
                    return matchup
                } else if (matchup.teams[1].team_id === this.team_id) {
                    return matchup
                }
            })[0].teams.filter(team => {
                if (team.team_id === this.team_id) {
                    return team
                }
            }).flatMap(team => {
                return team.stats
            })
        },
        projectedStats: function () {
            let players = toRaw(this.players)
            let stats = this.settings.map(stat => {
                if (this.schedule === undefined || Object.keys(players).length === 0 || this.schedule.length === 0) {
                    return { name: stat.name, value: 0 }
                }

                let value = players.map(player => {
                    let playerStats = player.starting.map((match) => { // Loop over each day in the week
                        // let gameStat = match.stats.filter((matchStat) => matchStat.stat_id === stat.stat_id.toString())
                        let averagedStat = player.averages.find((a) => a.stat === stat.stat_id.toString())
                        // game has been played
                        // if (gameStat.length > 0 && gameStat[0].value !== '-') {
                        //     return parseFloat(gameStat[0].value)
                        // } else 
                        if (match.gamePk > 0 && averagedStat?.value) {
                            return parseFloat(averagedStat.value)
                        } else {
                            return 0
                        }

                    })
                    let ps = playerStats.reduce((a, b) => {
                        return a + b
                    }, 0)

                    return ps
                }).reduce((a, b) => {
                    return a + b
                }, 0).toFixed(2)
                return { name: stat.name, value: value }
            })
            return stats
        }
    },
}
</script>
