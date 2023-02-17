<template>
  <tr>
    <td class="px-6 py-4 whitespace-nowrap">
      <button type="button"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {{ player.position_type }}
      </button>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <Profile :type="'player'" :player="player" :team="$attrs.team"></Profile>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      Totals
      <br />
      Projected
      <br />
      Averaged
    </td>
    <td class="px-6 py-4 whitespace-nowrap" v-for="stat in statLine" :key="stat.stat_id">
      <span>{{ stat.value }}</span>
      <br />
      {{ stat.projected }}
      <br />
      {{ stat.average }}
    </td>
  </tr>
</template>
<script>
import { useStore } from '../stores/index.js'
import { statIdToProjection, YahooCategoryToAPIStat } from '../utils/index'
import standardizeDate from '../utils/standardizeDate'
import Profile from './Profile.vue'
export default {
  name: 'Player',
  setup() {
    const store = useStore()
    return { store }
  },
  components: {
    Profile
  },
  props: ['player', 'team', 'allCategories', 'games'],
  computed: {
    statLine: function () {
      let self = this
      let statLine = this.player.stats?.stats?.filter(validStat => this.store.league.settings.stat_categories.find(category => category.stat_id === parseInt(validStat.stat_id))).map(scoringStat => {
        let statName = statIdToProjection(scoringStat.stat_id)
        let playerStats = this.player.starting.filter(day => day.game_id !== '').map(match => {
          if (match.status === 'Final') {
            let gameStats = this.player?.previousGames?.filter(previousGame => previousGame.gamePk === match.game_id)[0]
            if (gameStats !== undefined) {
              let statValue = YahooCategoryToAPIStat(statName, gameStats)
              if (isNaN(statValue) || statValue === undefined || statValue === null) {
                statValue = 0
              }
              return statValue
            }
            return 0
          } else {
            let statValue = YahooCategoryToAPIStat(statName, this.player.averages)
            if (isNaN(statValue) || statValue === undefined || statValue === null) {
              statValue = 0
            }
            return statValue * (1 - match.sos)
          }
          return statValue
        })
        let ps = playerStats.reduce((a, b) => {
          return a + b
        }, 0)
        let statValueRounded = Math.round((ps + Number.EPSILON) * 100) / 100
        let averageStat = YahooCategoryToAPIStat(statName, self.player.averages)?.toFixed(2)
        return { ...scoringStat, projected: statValueRounded, average: averageStat }
      })
      return statLine
    }
  },
  methods: {
  },
}
</script>
