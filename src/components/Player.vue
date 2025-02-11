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
import { toRaw } from 'vue';
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
      let projections = this.store.projections.flatMap((day) => {
        return day.value.data.filter((player) => {
          return player.Name === self.player.name.full
        })
      });
      let statLine = this.player.player_stats?.stats?.filter(validStat => this.store.league.settings.stat_categories.find(category => category.stat_id === parseInt(validStat.stat_id))).map(scoringStat => {
        let statName = statIdToProjection(scoringStat.stat_id)
        let averageStat = toRaw(self.player.averages).filter((average) => {
          return average.stat === scoringStat.stat_id
        })
        let projectedStat = projections.filter((projection) => projection.Games === 1).map(projection => {
          if (statName === 'PowerPlayPoints') {
            return projection['PowerPlayGoals'] + projection['PowerPlayAssists']
          }
          if (statName === 'GameWinningGoals') {
            return 0
          }
          if (statName === 'GoaltendingGoalsAgainstAverage') {
            return (projection['GoaltendingGoalsAgainst'] * 60) / 58
          }
          if (statName === 'GoaltendingSavePercentage') {
            return projection['GoaltendingSaves'] / projection['GoaltendingShotsAgainst']
          }
          return projection[statName]
        })
        let ps = projectedStat.reduce((a, b) => {
          return a + b
        }, 0)
        let statValueRounded = Math.round((ps + Number.EPSILON) * 100) / 100

        return { ...scoringStat, projected: statValueRounded, average: averageStat[0].value.toFixed(2) }
      })
      return statLine
    }
  },
  methods: {
  },
}
</script>
