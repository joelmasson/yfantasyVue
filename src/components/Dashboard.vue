<template>
  <div>
    <DashboardCard v-for="game in games" :key="game.game_id" :game="game"></DashboardCard>
    <!-- <h2>Other Teams</h2>
    <ul  v-if="inactiveGames.length >= 1">
      <DashboardCard v-for="game in inactiveGames" :key="game.game_id" :game="game"></DashboardCard>
    </ul>
    <h3 v-else>Sorry you have no inactive or favourtited Teams</h3> -->
   </div>
</template>
<script>
import axios from 'axios'

import DashboardCard from './DashboardCard.vue'

export default {
  name: 'Dashboard',
  data () {
    return {
      games: [],
      leagues: [],
      gameKeys: [],
      showInactive: false
    }
  },
  components: {DashboardCard},
  methods: {
    setGamesKeys: function () {
      let self = this
      axios.post('/api/games', {
        leagues: self.leagues
      })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          // self.updateStore()
          console.log('error', error)
        })
    },
    getUserAllGames: function () {
      let self = this
      axios
        .post('/api/yahoo/user/games')
        .then((response) => {
          console.log(response)
          let leagues = []
          response.data.games.forEach(game => {
            let flag = leagues.find(leauge => (leauge.name === game.name))
            if (flag) {
              flag.game_keys.push(game.game_key)
            } else {
              leagues.push({'name': game.name, 'game_keys': [game.game_key]})
            }
          })
          // self.setGamesKeys(leagues)
          let gameKeys = response.data.games.map(game => {
            return game.game_key
          })
          self.gameKeys = gameKeys
          self.getUserInactivesTeams(gameKeys)
        })
        .catch((errors) => {
          console.log(errors)
        })
    },
    getUserInactivesTeams: function (ids) {
      let self = this
      axios
        .post('/api/yahoo/user/game_leagues', {game_key: ids.slice(ids.length - 9)})
        .then((response) => {
          self.games = response.data.games.reverse()
        })
        .catch((errors) => {
          console.log(errors)
        })
    }
  },
  mounted () {
    // this.getUsersCurrentTeams()
    this.getUserAllGames()
  }
}
</script>
