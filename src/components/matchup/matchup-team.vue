<template>
  <div>
    <div class="bg-white shadow overflow-scroll sm:rounded-lg mb-10">
      <table class="min-w-full divide-y divide-gray-200" x-max="1">
        <thead>
          <tr>
            <th scope="col"
              class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              v-for="(category, i) in projectionsTotals" :key="i">
              {{ category.display_name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="(stat, i) in projectionsTotals" :key="i">
              {{ stat.value.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bg-white shadow overflow-scroll sm:rounded-lg mb-10" v-for="(player_type, i) in roster" :key="i">
      <!-- <TeamHeader :team="team" ></TeamHeader> -->
      <!-- <FilterMenu></FilterMenu> -->
      <table class="min-w-full divide-y divide-gray-200" x-max="1">
        <thead>
          <tr>
            <th scope="col"
              class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pos
            </th>
            <th scope="col"
              class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col"
              class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            </th>
            <th scope="col"
              class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              v-for="(category, i) in player_type.stats" :key="i">
              {{ category.display_name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <Player v-for="(player) in player_type.players" :key="player.player_id" :player="player" :team="team"
            :allCategories="false"></Player>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { useStore } from '../../stores/index.js'
import { statIdToProjection, gameDays } from '../../utils/index'

import TeamHeader from '../MatchupHeader.vue'
import FilterMenu from '../FilterMenu.vue'
import Player from '../Player.vue'
import Axios from 'axios'


import getPlayerAverages from '../../services/apiData';

export default {
  name: 'MatchupTeam',
  setup() {
    const route = useRoute()
    const store = useStore()
    store.getProjections(gameDays(this.store.league.scoreboard.matchups[0].week_start, this.store.league.scoreboard.matchups[0].week_end))
    return { store, route }
  },
  data() {
    return {
      game_id: this.$route.params.game_id,
      league_id: this.$route.params.league_id,
      week_num: this.$route.params.week_num,
      team: [],
      players: [],
      projectionsTotals: {},
      averages: []
    }
  },
  props: ['teamID'],
  components: {
    TeamHeader,
    FilterMenu,
    Player
  },
  methods: {
    getTeamPlayers: function () {
      let self = this
      Axios.post('/api/yahoo/players/teams', {
        team_key: self.game_id + '.l.' + self.league_id + '.t.' + self.team_id,
        subresources: ['stats']
      })
        .then((response) => {
          console.log(response)
          self.team = response.data[0]
          self.players = response.data[0].players.map(player => {
            return {
              ...player,
              projections: [],
              averages: []
            }
          })
          // this.getProjections()
          this.playerAverages()
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    getProjections() {
      let self = this
      let totals = []
      this.gameDays.forEach(date => {
        getDailyProjection(date).then((day) => {
          let projectedPlayers = day.filter(player => {
            let players = self.players.some(currentPlayer => {
              if (currentPlayer.name.full === player.Name) {
                return currentPlayer;
              }
            })
            if (players) {
              return players
            }
          })
          self.players.map(currentPlayer => {
            let player = projectedPlayers.filter(player => {
              if (player.Name === currentPlayer.name.full) {
                return player
              }
            })
            if (player.length > 0) {
              player = player.map(player => {
                player.PowerPlayPoints = player.PowerPlayAssists + player.PowerPlayGoals
                if (player.Games === 1){
                  player.GoaltendingSavePercentage = player.GoaltendingSaves / (player.GoaltendingSaves + player.GoaltendingGoalsAgainst)
                  player.GoaltendingGoalsAgainstAverage = player.GoaltendingGoalsAgainst
                }
                return player
              })
              if (currentPlayer.projections === undefined) {
                currentPlayer.projections = [player[0]]
              } else {
                currentPlayer.projections.push(player[0])
              }
            }
            return currentPlayer
          })
          // PROJECTED TOTALS
          projectedPlayers.forEach(player => {
            let stats = Object.keys(player)
            let value = Object.values(player)
            stats.forEach((stat, i) => {
              self.store.league.settings.stat_categories.forEach(cat => {
                if (statIdToProjection(cat.stat_id.toString()) === stat) {
                  if (totals[stat] === undefined) {
                    totals[stat] = 0
                  }
                  if (typeof value[i] !== 'string' || !value[i] instanceof String) {
                    totals[stat] += value[i]
                  }
                }
              })
            })
          })
          self.projectionsTotals = self.store.league.settings.stat_categories.map(cat => {
            let projectedStat = Object.keys(totals).filter(stat => {
              if (statIdToProjection(cat.stat_id.toString()) === stat){
                return totals[stat]
              }
            }).map(stat => {
              return totals[stat]
            })[0]
            return {
              'display_name':cat.display_name,
              'value':projectedStat === undefined ? 0 : projectedStat
            }
          })
        })
      })
    },
    playerAverages() {
      let self = this;
      let playerNames = this.players.map(player => player.name.full)
      getPlayerAverages(playerNames, 3, 'name').then(response => {
        self.players.map(player => {
          player.averages = response.filter(averagedStatline => {
            if (player.name.full === averagedStatline.name) {
              return player
            }
          })[0].previousGames
          return player
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
  },
  mounted() {
    this.getTeamPlayers()
  }
}
</script>
