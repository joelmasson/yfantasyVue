<template>
    <div>
        <TeamProfile :team="team" :settings="settings"></TeamProfile>
        <table class="min-w-full divide-y divide-gray-200" x-max="1">
            <thead>
                <tr>
                    <th
                        scope="col"
                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        v-for="(category, i) in settings"
                        :key="i"
                    >
                        {{ category.display_name }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" v-for="stat in actuals" :key="stat.stat_id">
                        {{stat.value}}
                    </td>
                </tr>
                <tr>
                    <td class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" v-for="stat in projections" :key="stat.stat_id">
                        {{stat.value}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import TeamProfile from '../TeamProfile.vue'
export default {
  name: 'matchupProjectionWeek',
  data () {
    return {
      categories: []
    }
  },
  props: ['settings', 'team', 'players', 'schedule'],
  components: {TeamProfile},
  computed: {
    // actuals: function () {
    //   if (Object.keys(this.team).length > 0) {
    //     return this.team.matchups.filter(matchup => {
    //       if (parseInt(matchup.week) === parseInt(this.$route.params.week_num)) {
    //         return matchup
    //       }
    //     })[0].teams.filter(team => {
    //       if (team.team_id === this.team.team_id) {
    //         return team
    //       }
    //     })[0].stats.map(stat => {
    //       if (stat.value === '') {
    //         stat.value = 0
    //       }
    //       return stat
    //     })
    //   } else {
    //     return {}
    //   }
    // },
    projections: function () {
      let gameDays = this.schedule.map((gameDay, gameDayIndex) => {
        let categories = this.settings.map(category => {
          let activePlayersStat = this.players.filter(activePlayer => {
            let active = activePlayer.rostered.filter(activeDay => {
              if (activeDay.date === gameDay.date) {
                if (activeDay.position !== 'BN' || activeDay.position !== 'IR+') {
                  return activeDay
                }
              }
            })
            if (active.length > 0) {
              return activePlayer
            }
            return activePlayer
          }).map(player => {
            let cat = ''
            let value = null
            switch (category.name) {
              case 'Goals':
                cat = 'GOAL'
                break
              case 'Assists':
                cat = 'ASSIST'
                break
              case 'Plus/Minus':
                cat = 'PLUS_MINUS'
                break
              case 'Penalty Minutes':
                cat = 'PENALTY_FOR'
                break
              case 'Powerplay Points':
                value = player.projectedStats['5_ON_3_GOAL'] + player.projectedStats['5_ON_4_GOAL'] + player.projectedStats['5_ON_4_ASSIST'] + player.projectedStats['5_ON_4_ASSIST_2']
                break
              case 'Game-Winning Goals':
                value = 0
                break
              case 'Faceoffs Won':
                cat = 'FACEOFF_WIN'
                break
              case 'Hits':
                cat = 'HIT'
                break
              case 'Blocks':
                cat = 'BLOCKED_SHOT'
                break
              case 'Wins':
                value = 0
                break
              case 'Goals Against':
                cat = 'GOAL_ALLOWED'
                break
              case 'Goals Against Average':
                cat = 'GOALS_AGAINST_AVERAGE'
                break
              case 'Saves':
                cat = 'SAVE'
                break
              case 'Shots Against':
                value = player.projectedStats['SAVE'] + player.projectedStats['GOAL_ALLOWED']
                break
              case 'Save Percentage':
                cat = 'SAVE_PERCENTAGE'
                break
              case 'Shutouts':
                cat = 'SHUTOUT'
                break
              default:
                break
            }
            // let gamesLeft = player.games.filter(game => {
            //   if (game.score === '- v -') {
            //     return game
            //   }
            // })
            if (value === null) {
              value = player.projectedStats[cat] === undefined ? 0 : player.projectedStats[cat]
              console.log(cat, value)
            }
            if (category.name === 'Save Percentage') {
              return value
            } else {
              let sos = player.games[gameDayIndex].sos === undefined ? 0 : player.games[gameDayIndex].sos
              // console.log(value, sos)
              return value * sos
            }
          }).reduce((a, b) => a + b)
          console.log(activePlayersStat)
          // let reduce = activePlayersStat.reduce((a, b) => a + b)
          return {
            stat_id: category.stat_id,
            value: Math.round((activePlayersStat + Number.EPSILON) * 100) / 100
          }
        })
        return categories
      })
      // // Loop over each Category
      //   // Loop over each GameDay
      //     // Loop over each Player
      //       activePlayer.rostered.filter(date => {
      //         if(date.date === gameDay.date)
      //       })
      //       if ( .!active.selected_position.includes('IR+')) {
      //         return active
      //       }
      //     }).map(player => {
      //       let cat = ''
      //       let value = null
      //       switch (category.name) {
      //         case 'Goals':
      //           cat = 'GOAL'
      //           break
      //         case 'Assists':
      //           cat = 'ASSIST'
      //           break
      //         case 'Plus/Minus':
      //           cat = 'PLUS_MINUS'
      //           break
      //         case 'Penalty Minutes':
      //           cat = 'PENALTY_FOR'
      //           break
      //         case 'Powerplay Points':
      //           value = player.projectedStats['5_ON_3_GOAL'] + player.projectedStats['5_ON_4_GOAL'] + player.projectedStats['5_ON_4_ASSIST'] + player.projectedStats['5_ON_4_ASSIST_2']
      //           break
      //         case 'Game-Winning Goals':
      //           value = 0
      //           break
      //         case 'Faceoffs Won':
      //           cat = 'FACEOFF_WIN'
      //           break
      //         case 'Hits':
      //           cat = 'HIT'
      //           break
      //         case 'Blocks':
      //           cat = 'BLOCKED_SHOT'
      //           break
      //         case 'Wins':
      //           value = 0
      //           break
      //         case 'Goals Against':
      //           cat = 'GOAL_ALLOWED'
      //           break
      //         case 'Goals Against Average':
      //           cat = 'GOALS_AGAINST_AVERAGE'
      //           break
      //         case 'Saves':
      //           cat = 'SAVE'
      //           break
      //         case 'Shots Against':
      //           value = player.projectedStats['SAVE'] + player.projectedStats['GOAL_ALLOWED']
      //           break
      //         case 'Save Percentage':
      //           cat = 'SAVE_PERCENTAGE'
      //           break
      //         case 'Shutouts':
      //           cat = 'SHUTOUT'
      //           break
      //         default:
      //           break
      //       }
      //       let gamesLeft = player.games.filter(game => {
      //         if (game.score === '- v -') {
      //           return game
      //         }
      //       })
      //       if (value === null) {
      //         value = player.projectedStats[cat] === undefined ? 0 : player.projectedStats[cat]
      //       }
      //       if (category.name === 'Save Percentage') {
      //         return value
      //       } else {
      //         return value * gamesLeft.length
      //       }
      //     }).reduce((a, b) => a + b)
      //   })
      //   if (category.name === 'Save Percentage' || category.name === 'Goals Against Average') {
      //     let goalies = this.players.filter(player => {
      //       if (player.eligible_positions === 'G') {
      //         return player
      //       }
      //     })
      //     let futureGoalieGames = goalies.map(player => {
      //       return player.games.filter(game => {
      //         if (game.score === '- v -') {
      //           return game
      //         }
      //       })
      //     }).length
      //     value = value / futureGoalieGames
      //     if (category.name === 'Goals Against Average') {
      //       value = value / goalies.length
      //     }
      //   }
      //   return {
      //     stat_id: category.stat_id,
      //     value: Math.round((value + Number.EPSILON) * 100) / 100

      //   }
      // })
      return gameDays
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
