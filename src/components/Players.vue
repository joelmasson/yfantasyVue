<template>
  <div>
    <Search @query="searchPlayers"></Search>
    <FilterMenu :statCategories="stats" :positions="positions" :teams="teams" :searchParams="searchParams" @filter="updateFilter"></FilterMenu>

    <table class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Pos
          </th>
          <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Player
          </th>
          <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" v-for="stat in stats" :key="stat.stat_id">
            <a v-on:click="sortBy(stat.stat_id)">
            {{stat.display_name}}
            </a>
          </th>
        </tr>
      </thead>
      <tbody v-if="players.length >= 1" class="bg-white divide-y divide-gray-200">
        <Player  v-for="player in players" :key="player.id" :player="player" :stats="stats" :allCategories="true"></Player>
      </tbody>
    </table>
  </div>
</template>
<script>
import Axios from 'axios'

import Search from './Search.vue'
import FilterMenu from './FilterMenu.vue'
import Player from './Player.vue'
export default {
  name: 'Players',
  data () {
    return {
      players: [],
      positions: [],
      stats: [],
      teams: [],
      searchParams: {
        league_keys: [
          this.$route.params.game_id + '.l.' + this.$route.params.league_id
        ],
        filter: {
          position: 'P',
          status: 'A',
          search: '',
          sort: 'OR',
          sort_type: 'season',
          sort_season: new Date().getFullYear(),
          sort_week: '',
          start: '',
          count: ''
        },
        subresources: ['stats', 'ownership']
      }
    }
  },
  methods: {
    searchPlayers: function (value) {
      console.log(value)
      this.searchParams.filter.search = value
      this.searchParams.filter.status = ''
      this.getPlayers()
    },
    updateFilter: function (status, position, stats) {
      console.log(stats)
      let statsFilter = stats.split('_')
      let date = new Date()
      this.searchParams.filter.position = position
      this.searchParams.filter.status = status
      this.searchParams.filter.stat1 = stats
      if (statsFilter[1] === 'S') {
        this.searchParams.filter.sort_season = statsFilter[2]
      }
      if (statsFilter[1] === 'L') {
        this.searchParams.filter.start = date.toISOString().slice(0, 10)
      }
      if (statsFilter[1] === 'L30') {
        date.setDate(date.getDate() - 30)
        this.searchParams.filter.start = date.toISOString().slice(0, 10)
      }
      if (statsFilter[1] === 'L14') {
        date.setDate(date.getDate() - 14)
        this.searchParams.filter.start = date.toISOString().slice(0, 10)
      }
      if (statsFilter[1] === 'L7') {
        date.setDate(date.getDate() - 7)
        this.searchParams.filter.start = date.toISOString().slice(0, 10)
      }
      if (statsFilter[0] === 'S') {
        // this.getPlayers()
      } else {
        // this.getAdvancedPlayers()
      }
      // this.getAdvancedPlayers()
      this.getPlayers()
    },
    sortBy: function (id) {
      this.searchParams.filter.sort = id
      this.getPlayers()
    },
    getPlayers: function () {
      let self = this
      console.log(self.searchParams)
      Axios.post('/api/yahoo/players/leagues', {
        league_keys: self.searchParams.league_keys,
        filter: self.searchParams.filter,
        subresources: self.searchParams.subresources
      })
        .then((response) => {
          console.log(response)
          self.players = response.data[0].players
          // self.league = response.data[0]
          // self.updateStore()

          // get player stats from internal
          //
        })
        .catch((error) => {
          // self.updateStore()
          console.log(error)
        })
    },
    getAdvancedPlayers: function () {
      let self = this
      console.log(self.searchParams)
      const playerKeys = self.players.map(player => {
        return player.player_key
      })
      console.log(playerKeys)
      Axios.post('/api/yahoo/players/fetch', {
        player_keys: '403.p.5698'
      })
        .then((response) => {
          console.log('A', response)
        })
        .catch((error) => {
          // self.updateStore()
          console.log(error)
        })
      // Axios.post('/api/yahoo/league/players', {
      //   league_key: this.searchParams.league_keys[0],
      //   player_key: playerKeys
      // })
      //   .then((response) => {
      //     console.log('A', response)
      //   })
      //   .catch((error) => {
      //     // self.updateStore()
      //     console.log(error)
      //   })
    },
    getLeagueSettings: function () {
      let self = this
      Axios.post('/api/yahoo/leagues/fetch', {
        league_key: this.searchParams.league_keys[0],
        subresources: ['settings', 'teams']
      })
        .then((response) => {
          console.log(response)
          const positions = response.data[0].settings.roster_positions.filter(position => {
            if (position.position_type !== undefined) {
              return position
            }
          })
          self.stats = response.data[0].settings.stat_categories
          self.teams = response.data[0].teams
          self.positions = positions
        })
        .catch((error) => {
          // self.updateStore()
          console.log(error)
        })
    },
    getGameData: function () {
      Axios.post('/api/yahoo/games/fetch', {
        game_key: 'nhl',
        subresources: ['stat_categories', 'position_types', 'roster_positions']
      })
        .then((response) => {
          console.log(response)
          if (this.$store === undefined) {
            self.stats = response.data[0].stat_categories
          } else {
            self.stats = this.$store.state.categories
          }
          console.log(self.stats)
          const positions = response.data[0].roster_positions.filter(position => {
            if (position.position_type !== undefined) {
              return position
            }
          })
          self.positions = positions
          console.log(positions)
          // self.league = response.data[0]
          // self.updateStore()
        })
        .catch((error) => {
          // self.updateStore()
          console.log(error)
        })
    }
  },
  components: {Search, FilterMenu, Player},
  mounted () {
    this.getPlayers()
    this.getAdvancedPlayers()
    this.getLeagueSettings()
  }
}
</script>
