<template>
  <tr>
    <td class="px-6 py-4 whitespace-nowrap">
      <button type="button"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {{player.position_type}}
      </button>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <Profile :type="'player'" :player="player" :team="$attrs.team"></Profile>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      Totals
      <br/>
      Projected
      <br />
      Averaged
    </td>
    <td class="px-6 py-4 whitespace-nowrap" v-for="stat in statLine" :key="stat.stat_id">
      <span>{{stat.value}}</span>
      <br/>
      {{stat.projected}}
    </td>
  </tr>
</template>
<script>
import { useStore } from '../stores/index.js'
import { statIdToProjection } from '../utils/index'
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
  props: ['player', 'team', 'allCategories'],
  computed: {
    statLine: function () {
      let self = this
      return this.player.stats.stats.map(scoringStat => {
        let statName = statIdToProjection(scoringStat.stat_id)
        let statValue = self.player.projections.map((stat) => {
          if(Object.keys(stat).filter((key) => {key === statName})){
            if (stat[statName] === undefined){
              return 0
            }
            return stat[statName]
          }
        }).reduce((curr, next) => curr + next, 0)
        if (statName === 'GoaltendingGoalsAgainstAverage' || statName === 'GoaltendingSavePercentage'){
          // Divide by number of games
          statValue = statValue / self.player.projections.length
        }
        let statValueRounded = Math.round((statValue + Number.EPSILON) * 100) / 100
        return {...scoringStat, projected:statValueRounded}
      })
    }
  },
  methods: {
  },
}
</script>
