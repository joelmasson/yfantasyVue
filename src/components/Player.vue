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
    <td class="px-6 py-4 whitespace-nowrap" v-for="stat in stats" :key="stat.stat_id">
      {{stat.value}}
      {{projectedStat(stat.stat_id)}}
    </td>
  </tr>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'
import {statIdToProjection} from '../utils/index'
import Profile from './Profile.vue'
export default {
  name: 'Player',
  setup() {
    const route = useRoute()
    const store = useStore()
    return { store }
  },
  components: {
    Profile
  },
  data() {
    return {
      stats: this.player.stats.stats
    }
  },
  props: ['player', 'team', 'allCategories', 'projections'],
  computed: {
    projectedStats: function () {

      if (this.allCategories) {
        let stats = []
        // this.player.stats.forEach(category => {
        //   let sat = this.player.stats.stats.some(stat => {
        //     if (parseInt(category.stat_id) === parseInt(stat.stat_id)) {
        //       stats.push(stat)
        //       return stat
        //     }
        //   })
        //   if (!sat) {
        //     stats.push({value: '-'})
        //   }
        // })
        return stats
      } else {
        let categories = this.store.league.settings.stat_categories.filter(stat => {
          if (stat.position_type === this.player.position_type) {
            return stat
          }
        }).map(category => {
          let value = this.player.stats.stats.filter(stat => {
            if (stat.stat_id === String(category.stat_id)) {
              return stat
            }
          })[0]
          if (value !== undefined) {
            category.value = value.value
          }
          return category
        })
        return categories
      }
    }
  },
  methods: {
    projectedStat: function (stat_id) {
      let statName = statIdToProjection(stat_id)
      
      let weekStat = this.projections.projections.map((stat) => {
        if(Object.keys(stat).filter((key) => {key === statName})){
          if (stat[statName] === undefined){
            return 0
          } else {
            return stat[statName]
          }
        }
      }).reduce((curr, next) => curr + next)
      return weekStat
    }
  },
  mounted() {
    // this.getPlayer()
  }
}
</script>
