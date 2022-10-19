<template>
  <div class="bg-white shadow-md rounded-lg">
      <!-- <MatchupProjectionWeek :settings="settings" :team="team" :players="fullPlayers" :schedule="games"></MatchupProjectionWeek> -->
      <MatchupPlayer v-for="player in fullPlayers" :key="player.player.nhl_player_id" :player="player" :chosenStat="chosenStat"></MatchupPlayer>
  </div>
</template>
<script>
import Axios from 'axios'
import MatchupPlayer from './matchup-player.vue'
import MatchupProjectionWeek from './matchup-projection-week.vue'
export default {
  name: 'MatchupTeam',
  components: {
    MatchupPlayer,
    MatchupProjectionWeek
  },
  data () {
    return {
      team: {},
      players: [],
      fullPlayers: [],
      availableSpots: [],
      availableTeams: [],
      replacements: [],
      playerGames: [],
      NHLSchedule: [],
      NHLStandings: []
    }
  },
  props: ['games', 'chosenStat', 'team_id', 'teams', 'settings'],
  methods: {
    getRoster: function () {
      /* -----
        Get all roster players and the days where they are starting from Yahoo
      ---- */
      let self = this
      // function getData () {
      Axios.post('/api/yahoo/roster/players', {
        team_key: self.$route.params.game_id + '.l.' + self.$route.params.league_id + '.t.' + self.team_id,
        date: self.$route.params.week_num
      }).then((response) => {
        console.log(response)
        let roster = response.data.roster
        self.team = roster
        self.fullPlayers = self.players.map(player => {
          let yPlayer = roster.filter(yPlayer => {
            if (player.name === yPlayer.name.full) {
              return yPlayer
            }
          })[0]
          player.player_id = yPlayer.player_id
          player.display_position = yPlayer.display_position
          player.headshot = 'https://' + yPlayer.headshot.url.split('https://')[2]
          player.eligible_positions = yPlayer.eligible_positions.toString()
          player.editorial_team_abbr = yPlayer.editorial_team_abbr
          player.selected_position = yPlayer.selected_position
          player.rostered = []
          return player
        })
        self.fullPlayers.forEach(fullPlayer => {
          let rosterPlayer = roster.filter(player => {
            if (fullPlayer.player_id === player.player_id) {
              return player
            }
          })[0]
          fullPlayer.rostered.push({position: rosterPlayer.selected_position, date: self.$route.params.week_num, opponentSOS: null})
        })
        // self.setPlayerGames()
        //   self.findAvailableSpots()
        //   self.$forceUpdate()
      }).catch((error) => {
        console.log(error)
      })
      // }
      // getData()
    },
    getPlayers: function (query) {
      /* -----
        Get all roster players and thier stats
      ---- */
      console.log('PLAYERS')
      function compare (a, b) {
        if (a.coverage_value < b.coverage_value) {
          return -1
        }
        if (a.coverage_value > b.coverage_value) {
          return 1
        }
        return 0
      }
      let self = this
      Axios.post('/api/players', {
        query: query
      }).then(response => {
        self.players = response.data.map(player => {
          let playbyplayGames = player.stats.filter(game => {
            let season = game.coverage_value.toString().substring(0, 4)
            if (game.coverage_type === 'Game') {
              return game
            }
          }).sort(compare)
          player.projectedStats = {}
          if (playbyplayGames.length >= 1) {
            Object.keys(playbyplayGames[0].stats).forEach(stat => {
              let last = playbyplayGames[0] === undefined ? 0 : (playbyplayGames[0].stats[stat])
              let two = playbyplayGames[1] === undefined ? 0 : (playbyplayGames[1].stats[stat])
              let three = playbyplayGames[2] === undefined ? 0 : (playbyplayGames[2].stats[stat])
              player.projectedStats[stat] = ((5 * last + 4 * two + 3 * three) / (5 + 4 + 3))
            })
          }
          return player
        })
        self.getRoster()
      }).catch(error => {
        console.log(error)
      })
    },
    findAvailableSpots: function () {
      // let gamesByTeam = []
      function compare (a, b) {
        if (a.count > b.count) {
          return -1
        }
        if (a.count < b.count) {
          return 1
        }
        return 0
      }
      let gameDays = this.games.filter(date => {
        if (new Date(date.date + 'T23:59:59.000-04:00') > new Date()) {
          return date
        }
      }).map(date => {
        return {date: date.date,
          roster_positions: [
            {position: 'C', count: 2},
            {position: 'LW', count: 2},
            {position: 'RW', count: 2},
            {position: 'D', count: 4},
            {position: 'Util', count: 1}
          ],
          games: date.games,
          totalOpenSpots: 0,
          proTeams: []}
      })
      gameDays.forEach((date, i) => {
        this.players.forEach(player => {
          if (player.selected_position !== '' || player.selected_position !== 'IR+') {
            let isPlayerInGame = date.games.filter(game => {
              if (game.awayId === player.currentTeamId || game.homeId === player.currentTeamId) {
                return game
              }
            })
            if (isPlayerInGame.length > 0) {
              // let position = player.display_position.split(',')
              // if (player.position_type === 'P') {
              //   position.push('Util')
              // }
              for (let index = 0; index < gameDays[i].roster_positions.length; index++) {
                if (player.selected_position === gameDays[i].roster_positions[index].position && gameDays[i].roster_positions[index].count > 0) {
                  gameDays[i].roster_positions[index].count -= 1
                  break
                }
              }
            }
          }
        })
        gameDays[i].totalOpenSpots = gameDays[i].roster_positions.reduce(function (a, b) {
          return {count: a.count + b.count} // returns object with property x
        }).count
        if (gameDays[i].totalOpenSpots > 0) {
          gameDays[i].games.forEach(game => {
            gameDays[i].proTeams.push(game.home.id)
            gameDays[i].proTeams.push(game.away.id)
          })
        }
      })
      this.availableSpots = gameDays
      // return array of teams [{team, team_id, count}, {team, team_id, count}...]
      let availableTeams = []
      gameDays.forEach(day => {
        if (day.totalOpenSpots > 0) {
          day.proTeams.forEach(team => {
            if (availableTeams.some(availableTeam => availableTeam.id === team)) {
              for (let index = 0; index < availableTeams.length; index++) {
                if (availableTeams[index].id === team) {
                  availableTeams[index].count += 1
                  break
                }
              }
            } else {
              availableTeams.push({id: team, count: 1, gameDays: {}})
            }
          })
        }
      })
      this.availableTeams = availableTeams.sort(compare)
      this.getTeamPlayers()
    },
    getTeamPlayers: function () {
      let maxGames = this.availableTeams[0].count
      // return the team/s with the highest number of games
      let teamsToQuery = this.availableTeams.filter(team => {
        if (team.count === maxGames) {
          return team
        }
      }).map(team => {
        return parseInt(team.id)
      })
      Axios.post('api/players', {
        query: {'fantasyTeamId': null, 'currentTeamId': {'$in': teamsToQuery}},
        limit: 20,
        sort: {'stats.stats.GAME_SCORE': -1}
      }).then(response => {
        console.log(response)
      })
    },
    projectedStat: function () {
      function compare (a, b) {
        if (a.coverage_value > b.coverage_value) {
          return -1
        }
        if (a.coverage_value < b.coverage_value) {
          return 1
        }
        return 0
      }
      let playbyplayGames = this.player.stats.filter(game => {
        let season = game.coverage_value.substring(0, 4)
        if (game.coverage_type === 'Game' && season === this.today.substring(0, 4)) {
          return game
        }
      }).sort(compare)
      return (5 * parseInt(playbyplayGames[0].stats[this.chosenStat]) + 4 * parseInt(playbyplayGames[1].stats[this.chosenStat]) + 3 * parseInt(playbyplayGames[2].stats[this.chosenStat])) / (5 + 4 + 3)
    },
    gameSOS: function (opponent) {
      // Get Opponent's Schedule
      let opponentSchedule = this.NHLSchedule.filter(game => {
        if (game.teams.home.team.id === opponent) {
          return game
        } else if (game.teams.away.team.id === opponent) {
          return game
        }
      })
      // Get Opponent's Opponents Record
      let allOpponents = opponentSchedule.map(game => {
        if (game.teams.home.team.id === opponent) {
          return game.teams.away.team.id
        } else if (game.teams.away.team.id === opponent) {
          return game.teams.home.team.id
        }
      })
      let OOR = this.NHLStandings.filter(team => {
        if (allOpponents.includes(team.team.id)) {
          return team
        }
      }).map(team => {
        return team.pointsPercentage
      }).reduce(function (a, b) {
        return a + b
      })
      let opponentRecord = this.NHLStandings.filter(team => {
        if (opponent === team.team.id) {
          return team
        }
      }).map(team => {
        return team.pointsPercentage
      })
      return ((2 * (opponentRecord)) + (OOR / allOpponents.length)) / 3
    },
    setPlayerGames: function () {
      let players = this.players.map(player => {
        player.set = false
        player.games = this.games.map(date => {
          let gameObject = {
            displayedStat: null,
            matchup: null,
            score: null,
            stats: null
          }
          let isPlayerInGame = date.games.filter(game => {
            if (game.awayId === player.currentTeamId || game.homeId === player.currentTeamId) {
              return game
            }
          })
          if (isPlayerInGame.length > 0) {
            let opponent
            if (isPlayerInGame[0].homeId === player.currentTeamId) {
              gameObject.matchup = isPlayerInGame[0].away.name_abbv
              opponent = isPlayerInGame[0].awayId
            } else if (isPlayerInGame[0].awayId === player.currentTeamId) {
              gameObject.matchup = '@' + isPlayerInGame[0].home.name_abbv
              opponent = isPlayerInGame[0].homeId
            }
            gameObject.sos = this.gameSOS(opponent)
            if (isPlayerInGame[0].events.length > 0) { // GAME HAS BEEN PLAYED
              let gameStats = player.stats.filter(game => {
                if (game.coverage_value === isPlayerInGame[0].gamePk) {
                  return game
                }
              })
              gameObject.stats = gameStats
              gameObject.displayedStat = Object.keys(gameStats).filter(stat => {
                if (stat === this.chosenStat) {
                  return gameStats[gameStats]
                }
              })
              gameObject.score = isPlayerInGame[0].homeScore + ' v ' + isPlayerInGame[0].awayScore
            } else {
              gameObject.stats = player.stats.filter(game => {
                if (game.coverage_type === 'Game') {
                  return game
                }
              }).slice(-3)
              gameObject.displayedStat = 0
              gameObject.stats.forEach((game, i) => {
                Object.keys(game.stats).forEach(stat => {
                  if (stat === this.chosenStat) {
                    gameObject.displayedStat = gameObject.displayedStat === undefined ? game.stats[stat] : (gameObject.displayedStat + game.stats[stat]) / 2
                  }
                })
              })
              gameObject.score = '- v -'
            }
          }
          return gameObject
        })
        return player
      })
      let setRoster = []
      this.rosterSpots.forEach(spot => {
        players.forEach(player => {
          if (spot.position === player.selected_position && !player.set) {
            player.set = true
            let rosterSpotObj = {
              position: spot.position,
              player: player
            }
            setRoster.push(rosterSpotObj)
          }
        })
      })
      this.playerGames = setRoster
      // this.setRosterSOS()
    },
    // setRosterSOS: function () {
    //   this.fullPlayers.forEach(player => {
    //     player.rostered.forEach((date, i) => {
    //       date.opponentSOS = this.games[i].sos
    //     })
    //   })
    //   this.$forceUpdate()
    // },
    getNHLSchedule: function () {
      let self = this
      Axios.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=' + this.$store.state.league.start_date + '&endDate=' + this.today).then((response) => {
        self.NHLSchedule = response.data.dates.flatMap(date => {
          return date.games
        })
      }).catch((error) => {
        console.log('error', error)
      })
    },
    getNHLStandings: function () {
      let self = this
      Axios.get('https://statsapi.web.nhl.com/api/v1/standings').then((response) => {
        self.NHLStandings = response.data.records.flatMap(date => {
          return date.teamRecords
        })
      }).catch((error) => {
        console.log('error', error)
      })
    }
  },
  computed: {
    today: function () {
      let today = new Date()
      return today.toISOString().split('T')[0]
    },
    rosterSpots: function () {
      return this.$store.state.positions.map(spot => {
        let spots = []
        let rosterSpotObj = {
          position: spot.position,
          player: {}
        }
        for (let index = 0; index < parseInt(spot.count); index++) {
          spots.push(rosterSpotObj)
        }
        return spots
      }).flat()
    }
  },
  mounted () {
    this.getRoster()
    // this.getPlayers({'fantasyTeamId': this.$route.params.game_id + '.l.' + this.$route.params.league_id + '.t.' + this.$props.team_id})
    // this.getNHLSchedule()
    // this.getNHLStandings()
  }
}
</script>
