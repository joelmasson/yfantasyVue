<template>
<div>
    <table class="min-w-full divide-y divide-gray-200" x-max="1">
      <thead>
        <tr>
          <th scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Season
          </th>
          <th
            scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            v-for="(category, i) in allCategories"
            :key="i"
          >
            {{ category.display_name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(year, i) in statsData" :key="i">
          <td class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{year.coverage_value}}</td>
          <td class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" v-for="stat in year.stats" :key="stat.stat_id">
            {{stat.value}}
          </td>
        </tr>
        <!-- <Player
          v-for="player in player_type.players"
          :key="player.player_id"
          :player="player"
          :team="team"
          :allCategories="false"
        ></Player> -->
      </tbody>
    </table>
</div>
</template>
<script>
import Axios from 'axios'
export default {
  name: 'Stats',
  data () {
    return {
      allCategories: []
    }
  },
  props: [
    'statsData'
  ],
  methods: {
    getAllallCategories: function () {
      let self = this
      Axios.post('/api/yahoo/game/stat_categories', {
        game_key: 'nhl'
      })
        .then((response) => {
          self.allCategories = response.data.stat_categories
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  computed: {
    // categories: function () {
    //   return this.$store.state.categories.filter(category => {
    //     if (category.position_type === this.statsData.position_type) {
    //       return category
    //     }
    //   })
    // }
  },
  mounted () {
    this.getAllallCategories()
  }
}
</script>
