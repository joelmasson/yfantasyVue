<template>
  <div>
    <Standings :standings='this.store.league'></Standings>
    <Matchups :league='this.store.league' @selectedWeek="updateSelectedWeek"></Matchups>
  </div>
</template>
<script>
import Axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'

import Standings from './Standings.vue'
import Matchups from './Matchups.vue'
export default {
  name: 'League',
  setup() {
    const route = useRoute()
    const store = useStore()
    store.getYahooLeague(route.params.game_id, route.params.league_id)
    return { store, route }
  },
  data() {
    return {
      league: {
        scoreboard: {
          matchups: []
        }
      },
      league_keys: [],
      sports: [{
        'league': 'nhl',
        'sport': 'Hockey'
      },
      {
        'league': 'nfl',
        'sport': 'Football'
      }],
      season: {},
      scrapedSeason: {},
      proData: {},
      playByPlayData: [],
      dates: [],
      currentWeek: 1,
    }
  },
  components: {
    Standings, Matchups
  },
  computed: {
    // league_abbr: function () {
    //   return this.sports.filter(sport => {
    //     if (sport.league === this.league.game_code) {
    //       return sport
    //     }
    //   })[0].sport
    // }
  },
  methods: {
    getPastLeaugeKeys: function () {
      let self = this
      Axios.get('/api/games/1', {
        league_key: self.league.game_code
      })
        .then((response) => {
          self.league_keys = response.data.filter(league => {
            if (league.name === self.league_abbr) {
              return league
            }
          })[0].game_keys
          self.updateStore()
        })
        .catch((error) => {
          // self.updateStore()
          console.log('error', error)
        })
    },
    // getYahooLeague: function () {
    //   let self = this
    //   Axios.post('/api/yahoo/leagues/fetch', {
    //     league_keys: [
    //       this.$route.params.game_id + '.l.' + this.$route.params.league_id
    //     ],
    //     subresources: ['settings', 'standings', 'scoreboard', 'teams', 'transactions']
    //   })
    //     .then((response) => {
    //       console.log(response)
    //       if (!('error' in response)) {
    //         self.league = response.data[0]
    //         // self.matchups = response.data[0].scoreboard.matchups
    //         // self.updateSelectedWeek(response.data[0].current_week)
    //         // self.getPastLeaugeKeys()
    //         self.updateStore()
    //         // self.getCurrentSeason()
    //         // self.getYahooOwnership()
    //       }
    //     })
    //     .catch((error) => {
    //       // self.updateStore()
    //       console.log('error', error)
    //     })
    // },
    getCurrentExternalSeason: function () {
      let self = this
      let season = this.store.league.season + (parseInt(this.store.league.season) + 1)
      Axios.get('https://statsapi.web.nhl.com/api/v1/schedule?season=' + season)
        .then(response => {
          console.log(response.data)
          self.scrapedSeason = response.data
          self.season = response.data
          self.saveSeason()
        }).catch((error) => {
          console.log('error', error)
        })
    },
    getCurrentSeason: function () {
      console.log('season')
      let self = this
      Axios.get('/api/season/' + this.route.params.game_id)
        .then(response => {
          let today = new Date()
          // self.getSeasonPlayers()
          if (response.data.error === 'Season not found') {
            self.getCurrentExternalSeason()

          } else {
            // league has started
            if (today > new Date(response.data.startDate) && response.data !== 'No PBP available') {
              self.season = response.data
              self.dates = response.data.dates.filter(date => {
                if (response.data.lastGameDayPlayed < date.date) {
                  return date.date
                }
              })
              if (self.dates.length > 0) {
                self.getExtenalPlayByPlay(self.dates[0].date, self.dates[0].date)
              }
            }
          }
        }).catch((error) => {
          console.log('error', error)
        })
    },
    saveSeason: function () {
      let self = this
      let seasonData = {
        'name': self.league.season + (parseInt(self.league.season) + 1),
        'game_key': self.$route.params.game_id,
        'totalGames': self.season.totalGames,
        'lastGameDayPlayed': new Date(self.season.dates[0].date),
        'startDate': self.season.dates[0].date,
        'dates': self.season.dates.map(date => {
          return {
            'date': date.date,
            'games': date.games.map(game => {
              return {
                'gamePk': game.gamePk,
                'gameDate': game.dateDate
              }
            })
          }
        })
      }
      Axios.post('/api/season', {
        data: seasonData
      }).then(response => {
        self.season = response.data
        self.saveSchedule()
      }).catch((error) => {
        console.log(error)
      })
    },
    getGameKeys: function () {
      let self = this
      Axios.get('/api/games', {}).then((response) => {
        self.leagues = response.data
      }).catch((error) => {
        // self.updateStore()
        console.log('error', error)
      })
    },
    getExtenalPlayByPlay: function (start, end) {
      let self = this
      Axios.post('/api/playbyplay/', {
        action: 'fetch',
        game_key: self.season.game_key,
        start: start,
        end: end
      }).then((response) => {
        let today = new Date()
        if (today > new Date(self.dates[1].date)) {
          // if (response.data !== 'No PBP available') {
          self.dates = self.dates.slice(1)
          self.getExtenalPlayByPlay(self.dates[0].date, self.dates[0].date)
        }
      }).catch((error) => {
        // self.updateStore()
        console.log('error', error)
      })
    },
    saveSchedule: function () {
      // let self = this
      let games = this.scrapedSeason.dates.map(date => {
        return date.games.map(game => {
          let date = new Date(game.gameDate)
          return {
            'timestamp': date,
            'game_key': this.$route.params.game_id,
            'gamePk': game.gamePk,
            'homeId': game.teams.home.team.id,
            'awayId': game.teams.away.team.id,
            'homeScore': game.teams.home.score,
            'awayScore': game.teams.away.score
          }
        })
      }).flat()
      Axios.post('/api/playbyplay', {
        action: 'add',
        data: games
      }).then(response => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    },
    getSeasonPlayers: function () {
      console.log('get')
      let season = this.store.league.season + (parseInt(this.store.league.season) + 1)
      Axios.get('/api/players/' + season)
        .then(response => {
          console.log('players', response)
        }).catch((error) => {
          console.log(error)
        })
    },
    getYahooOwnership: function () {
      let teamKeys = this.store.league.standings.map(team => {
        return team.team_key
      })
      Axios.post('/api/yahoo/players/teams', {
        team_key: teamKeys,
        subresources: ['ownership']
      }).then(response => {
        let teams = response.data
        let players = teams.map(team => {
          return team.players.map(player => {
            return { name: player.name.full, fantasyTeamId: player.ownership.owner_team_key }
          })
        }).flat()
        this.setFantasyOwnership(players)
      })
    },
    getMatchups: function (week) {
      // let self = this
      // Axios.post('/api/yahoo/league/scoreboard', {
      //   league_key: this.$route.params.game_id + '.l.' + this.$route.params.league_id,
      //   week: week
      // }).then(response => {
      //   console.log('here')
      //   self.matchups = response.data.scoreboard.matchups
      // }).catch((error) => {
      //   console.log('error', error)
      // })
    },
    setFantasyOwnership: function (players) {
      console.log('update')
      Axios.post('/api/players', {
        action: 'updateOwnership',
        players: players
      }).then(update => {
        console.log(update)
      })
    },
    updateSelectedWeek: function (value) {
      this.currentWeek = value
      this.getMatchups(value)
    }
  },
  mounted() {
    this.getCurrentSeason()
    this.getMatchups()
    this.getYahooOwnership()
    // Check if the season data is saved
  }
}
</script>
