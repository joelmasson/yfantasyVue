<template>
  <div>
    <div class="flex items-center">
      <div class="flex-shrink-0 h-10 w-14">
        <img class="h-10 w-14 rounded-full" :src="playerData.image" :alt="playerData.name" />
      </div>
    </div>
    <div>
      <div class="ml-4">
        <div class="text-sm font-medium text-gray-900">
          <h4>{{playerData.name}}</h4>
          <h5>{{playerData.team}} - {{playerData.position}}</h5>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="w-full">
        <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
          <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal" v-on:click="toggleTabs('summary')" v-bind:class="{'text-pink-600 bg-white': openTab !== 'summary', 'text-white bg-pink-600': openTab === 'summary'}">
              Stats
            </a>
          </li>
          <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal" v-on:click="toggleTabs(2)" v-bind:class="{'text-pink-600 bg-white': openTab !== 2, 'text-white bg-pink-600': openTab === 2}">
              Projections
            </a>
          </li>
          <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal" v-on:click="toggleTabs(3)" v-bind:class="{'text-pink-600 bg-white': openTab !== 3, 'text-white bg-pink-600': openTab === 3}">
              Options
            </a>
          </li>
        </ul>
        <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div class="px-4 py-5 flex-auto">
            <div class="tab-content tab-space">
              <div v-bind:class="{'hidden': openTab !== 'summary', 'block': openTab === 'summary'}">
                <Stats :statsData="careerStats"></Stats>
              </div>
              <div v-bind:class="{'hidden': openTab !== 2, 'block': openTab === 2}">
                <Projections :player="playerData" v-if="playerUpdated"></Projections>
              </div>
              <div v-bind:class="{'hidden': openTab !== 3, 'block': openTab === 3}">
                <p>
                  Efficiently unleash cross-media information without
                  cross-media value. Quickly maximize timely deliverables for
                  real-time schemas.
                  <br />
                  <br />
                  Dramatically maintain clicks-and-mortar solutions
                  without functional solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
import Profile from './Profile.vue'
import Stats from './Stats.vue'
import Projections from './player/projections.vue'
export default {
  name: 'PlayerPage',
  data () {
    return {
      playerData: {
        _id: null,
        y_player_id: null,
        s_player_id: null,
        name: 'John Doe',
        team_name: 'Team Name',
        team_name_abbr: 'ABC',
        uniform_number: '00',
        league_abbr: 'abc',
        image: '',
        position_type: 'X',
        eligible_positions: 'X',
        rookie_season: 0,
        seasons: [],
        stats: []
      },
      openTab: 'summary',
      savedPlayer: false,
      playerUpdated: false,
      current_season: null
    }
  },
  components: {
    Profile,
    Stats,
    Projections
  },
  computed: {
    careerStats: function () {
      return this.playerData.stats.filter(season => {
        if (season.coverage_type === 'season') {
          return season
        }
      })
    }
  },
  methods: {
    toggleTabs: function (tab) {
      this.openTab = tab
    },
    getPastLeaugeKeys: function () {
      Axios.get('/api/games/all')
        .then((response) => {
          let data = response.data.filter(league => {
            if (league.game_keys.includes(this.$route.params.game_id)) {
              return league
            }
          })[0].game_keys
          this.$store.commit('setLeagueKeys', data)
          this.getPlayer()
        })
        .catch((error) => {
          // self.updateStore()
          console.log('error', error)
        })
    },
    getYahooPlayer: function (keys) {
      let self = this
      let gameKey = parseInt(keys.split('.')[0])
      if (gameKey > this.playerData.rookie_season) {
        Axios.post('/api/yahoo/players/fetch', {
          player_keys: keys,
          subresources: ['stats', 'ownership', 'percent_owned', 'draft_analysis']
        }).then((response) => {
          let data = response.data[0]
          if (self.current_season === null) {
            // self.playerData = data
            self.playerData.y_player_id = data.player_id
            self.playerData.name = data.name.full
            self.playerData.team_name = data.team_name_abbr
            self.playerData.team_name_abbr = data.team_name_abbr
            self.playerData.league_abbr = data.editorial_team_key.split('.')[0]
            self.playerData.image = 'https://' + data.image_url.split('https://')[2]
            self.playerData.position_type = data.position_type
            self.playerData.eligible_positions = data.eligible_positions
            self.current_season = data.stats.coverage_value
            self.playerData.stats = [data.stats]
            self.playerData.seasons = [{
              year: data.stats.coverage_value,
              y_season_key: this.$route.params.game_id
            }]
            self.playerUpdated = true
          } else {
            self.playerData.stats.push(data.stats)
          }
          let keys = self.$store.state.league_keys.sort(function (a, b) { return b - a })
          let next = keys.filter(key => {
            if (key < gameKey) {
              return key
            }
          })
          console.log('get next season')
          self.getYahooPlayer(next[0] + '.p.' + this.$route.params.player_id)
        }).catch(error => {
          self.rookie_season = gameKey
          self.savedPlayer ? self.updatePlayer() : self.savePlayer()
          console.log(error, keys)
        })
      }
    },
    getPlayer: function () {
      let self = this
      Axios.get('api/player/' + this.$route.params.player_id).then(response => {
        console.log(response.data)
        if (response.data.error === 'Player not found') {
          // Player not found
          this.getYahooPlayer(this.$route.params.game_id + '.p.' + this.$route.params.player_id)
        } else {
          let data = response.data
          self.playerData = data
          self.playerData.position = data.eligible_positions.toString()
          self.playerUpdated = true
          // self.playerData.image = data.image
          // self.playerData.team = data.team_name_abbr
          if (self.rookie_season === 0) {
            let seasons = self.$store.state.league_keys.length - 1
            let keys = self.$store.state.league_keys.sort(function (a, b) { return a - b })
            this.getYahooPlayer(keys[seasons] + '.p.' + this.$route.params.player_id)
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    savePlayer: function () {
      let self = this
      let data = this.playerData
      delete data._id
      console.log('save')
      Axios.post('api/player', {
        data: data
      }).then(response => {
        self.savedPlayer = true
      }).catch((error) => {
        console.log(error)
      })
    },
    updatePlayer: function () {
      let self = this
      console.log('update')
      Axios.put('api/player', {
        data: self.playerData
      }).then(response => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  mounted () {
    if (this.$store.state.league_keys.length === 0) {
      this.getPastLeaugeKeys()
    } else {
      this.getPlayer()
    }
  }
}
</script>
