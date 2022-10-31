<template>
  <div>
    <div
      class="bg-white shadow overflow-scroll sm:rounded-lg mb-10"
      v-for="(player_type, i) in roster"
      :key="i"
    >
      <!-- <TeamHeader :team="team" ></TeamHeader> -->
      <!-- <FilterMenu></FilterMenu> -->
      <table class="min-w-full divide-y divide-gray-200" x-max="1">
        <thead>
          <tr>
            <th
              scope="col"
              class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Pos
            </th>
            <th
              scope="col"
              class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
            </th>
            <th
              scope="col"
              class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              v-for="(category, i) in player_type.stats"
              :key="i"
            >
              {{ category.display_name }}
            </th>

          </tr>
        </thead>
        <tbody>
          <Player
            v-for="(player, index) in player_type.players"
            :key="player.player_id"
            :player="player"
            :team="team"
            :allCategories="false"
            :projections="projections[index]"
          ></Player>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'
import TeamHeader from './TeamHeader.vue'
import FilterMenu from './FilterMenu.vue'
import Player from './Player.vue'
import Axios from 'axios'

import getDailyProjection from '../services/sportsData'
import getPlayerAverages from '../services/apiData';

export default {
  name: 'Team',
  setup() {
    const route = useRoute()
    const store = useStore()
    
    return { store, route }
  },
  data () {
    return {
      game_id: this.$route.params.game_id,
      league_id: this.$route.params.league_id,
      week_num: this.$route.params.week_num,
      team: [],
      players: [],
      projections: [],
    }
  },
  props: ['teamID'],
  components: {
    TeamHeader,
    FilterMenu,
    Player
  },
  methods: {
    getRoster: function () {
      let self = this
      Axios.post('/api/yahoo/roster/players', {
        team_key: [
          self.game_id +
            '.l.' +
            self.league_id +
            '.t.' +
            self.team_id
        ],
        date: self.week_num
      })
        .then((response) => {
          self.team = response.data
          response.data.roster.forEach(player => {
            self.getPlayerStats(player.player_key, self.week_num)
          })
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    getTeamPlayers: function () {
      let self = this
      Axios.post('/api/yahoo/players/teams', {
        team_key: self.game_id + '.l.' + self.league_id + '.t.' + this.route.params.team_id,
        subresources: ['stats']
      })
        .then((response) => {
          console.log(response)
          self.team = response.data[0]
          self.players = response.data[0].players
          self.projections = response.data[0].players.map(player => {
            return {
              name: player.name.full,
              projections: []
            }
          })
          this.getProjections()
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    getPlayerStats: function (key, week) {
      let self = this
      Axios.post('/api/yahoo/player/stats', {
        player_key: key,
        week: week
      }).then((response) => {
        console.log(response)
        let player = response.data
        let weekProjected = []
        let projectedStats = response.data.stats.stats
        self.projections.forEach(dates => {
          dates.forEach(player => {
            if (response.data.name.full === player.Name) {
              weekProjected.push(player)
            }
          })
        })
        weekProjected.forEach((day) => {
          for (const stat in day) {
            let formattedCategory = stat.replace('/', '')
            if (store.state.categories.some(category => {
              if (category.name === formattedCategory) {
                return true
              }
            })) {
              if (projectedStats.some(category => {
                if (category.stat_id === 'p-' + stat) {
                  return true
                }
              })) {
              } else {
                let id = store.state.categories.filter(category => {
                  if (category.name === formattedCategory) {
                    return category
                  }
                })[0]
                let flag = projectedStats.find(stat => stat.stat_id === 'p-' + id.stat_id)
                if (flag !== undefined) {
                  projectedStats.find(projectedStat => {
                    if (projectedStat.stat_id === 'p-' + id.stat_id) {
                      projectedStat.value = projectedStat.value + day[stat]
                    }
                  })
                }
                projectedStats.push({'value': day[stat], 'stat_id': 'p-' + id.stat_id})
              }
            }
          }
        })
        player.projected = projectedStats
        self.players.push(player)
      }).catch((error) => {
        console.log(error)
      })
    },
    getAdvancedStats() {

    },
    getProjections () {
      let self = this
      this.gameDays.forEach(date => {
        getDailyProjection(date).then((response) => {
          response.forEach(player => {
            self.projections.forEach(rostered => {   
              if (rostered.name == player.Name) {
                rostered.projections.push(player)
              }
            })
          })
        })
      })
    },
    getPlayerAverages () {
      let self = this;
      let playerNames = this.players.map(player => player.name.full)
      getPlayerAverages(playerNames, 3).then(response => {
        self.projections = self.projections.map(projected_player => {
          let playerAverageStates = response.filter(player => {if(player.nhl_player_id === projected_player.nhl_player_id) return player})
          return {player, ...playerAverageStates}
        })
      })
    }
  },
  computed: {
    roster: function () {
      let positions = Array.from(
        new Set(
          this.store.league.settings.stat_categories.map((category) => {
            return category.position_type
          })
        )
      )
      let positionsObj = positions.map((position) => {
        // Returns an object for each position
        return { position_type: position, players: [], stats: [] }
      })
      this.players.forEach((player) => {
        positionsObj.forEach((position) => {
          if (position.position_type === player.position_type) {
            position.players.push(player)
          }
        })
      })
      this.store.league.settings.stat_categories.forEach((category) => {
        positionsObj.forEach((position) => {
          if (position.position_type === category.position_type) {
            position.stats.push(category)
          }
        })
      })
      return positionsObj
    },
    team_id: function () {
      return this.teamID === undefined ? this.$route.params.team_id : this.teamID
    },
    gameDays () {
      function convertDate (date) {
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        var yyyy = date.getFullYear().toString()
        var mm = (date.getMonth()).toString()
        var dd = date.getDate().toString()

        var ddChars = dd.split('')

        return yyyy + '-' + months[mm] + '-' + (ddChars[1] ? dd : '0' + ddChars[0])
      }
      function getDates (start, end) {
        let arr = []
        end = new Date(end.setDate(end.getDate() + 2))
        for (start; start < end; start = new Date(start.setDate(start.getDate() + 1))) {
          arr.push(convertDate(new Date(start)))
        }
        return arr
      };
      return getDates(new Date(this.store.league.scoreboard.matchups[0].week_start), new Date(this.store.league.scoreboard.matchups[0].week_end))
    }
  },
  mounted () {
    this.getTeamPlayers()
  }
}
</script>
