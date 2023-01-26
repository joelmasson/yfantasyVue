<template>
  <div class="bg-white shadow-md rounded-lg" v-if="players.length > 0 && weekMatches.length > 0">
    <Replacements :teamGames="teamGames" :schedule="weekMatches"></Replacements>
    <MatchupProjectionWeek :settings="store.league.settings.stat_categories" :players="players" :schedule="weekMatches"
      :scoreboard="scoreboard"></MatchupProjectionWeek>
    <MatchupPlayer v-for="player in players" :key="player.player_id" :player="player" :dates="gameDay"
      :schedule="weekMatches">
    </MatchupPlayer>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'
import { gameDays } from '../utils/index.ts'
import { teamNamesAbv } from '../utils/teamNames'
import getPlayerAverages from '../services/apiData';
import standardizeDate from '../utils/standardizeDate'

import Axios from 'axios'
import MatchupPlayer from './matchup/matchup-player.vue'
import MatchupProjectionWeek from './matchup/matchup-projection-week.vue'
import Replacements from './replacements/replacementBanner.vue'
export default {
  name: 'Team',
  components: {
    MatchupPlayer,
    MatchupProjectionWeek,
    Replacements
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    let availableSpots = ref([])
    let scoreboard = ref(null)
    let gameDay = ref([])
    let players = ref({})
    let NHLStandings = ref({})
    let NHLSchedule = ref({})
    let weekMatches = ref({})
    let teamGames = ref({})
    let roster = ref([{ position: "C", count: 2 }, { position: "RW", count: 2 }, { position: "LW", count: 2 }, { position: "D", count: 4 }, { position: "Util", count: 1 }, { position: "G", count: 2 }],)

    // store.getProjections()
    function getScoreBoard() {
      return Axios.post('/api/yahoo/league/scoreboard', {
        league_key: store.league.league_key,
        week: route.params.week_num
      }).then((response) => {
        scoreboard.value = response.data.scoreboard.matchups
        gameDay.value = gameDays(scoreboard.value[0].week_start, scoreboard.value[0].week_end)
        getRoster()
      }).catch((error) => {
        console.log('error', error)
      })
    }
    function getRoster() {
      /* -----
        Get all roster players and the days where they are starting from Yahoo
      ---- */
      let startingLineupPromise = gameDay.value.map(date => {
        let day = new Date(date)
        let yyyy = day.getFullYear().toString()
        let mm = (day.getMonth() + 1)
        let dd = day.getDate().toString()
        return Axios.post('/api/yahoo/roster/players', {
          team_key: route.params.game_id + '.l.' + route.params.league_id + '.t.' + route.params.team_id,
          date: yyyy + '-' + mm + '-' + dd
        }).then((response) => {
          return response.data.roster
        })
      })

      Promise.allSettled(startingLineupPromise).then(response => {
        console.log(weekMatches.value)
        let roster = response[0].value.map(player => {
          return {
            ...player,
            averages: [],
            previousGames: [],
            starting: []
          }
        })
        response.forEach((day, i) => {
          roster.forEach(player => {
            let dayPlayer = day.value.filter(gamePlayer => {
              if (gamePlayer.player_id === player.player_id) {
                return gamePlayer
              }
            })
            if (dayPlayer.length > 0) {
              player.starting.push({ date: gameDay.value[i], position: dayPlayer[0].selected_position, game_id: '' })
            }
          })
        })
        players.value = roster
        getWeekSchedule()
      })
    }
    function getNHLStandings() {
      Axios.get('https://statsapi.web.nhl.com/api/v1/standings').then((response) => {
        NHLStandings.value = response.data.records.flatMap(date => {
          return date.teamRecords
        })
      }).catch((error) => {
        console.log('error', error)
      })
    }
    function getNHLSchedule() {
      Axios.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=' + store.league.start_date + '&endDate=' + store.league.end_date).then((response) => {
        NHLSchedule.value = response.data.dates.flatMap(date => {
          return date.games
        })
      }).catch((error) => {
        console.log('error', error)
      })
    }
    function getWeekSchedule() {
      function compare(a, b) {
        if (a.games > b.games) {
          return -1
        }
        if (a.games < b.games) {
          return 1
        }
        return 0
      }
      console.log(store.league.scoreboard.matchups[0])
      Axios.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=' + store.league.scoreboard.matchups[0].week_start + '&endDate=' + store.league.scoreboard.matchups[0].week_end).then((response) => {
        let arrayOfGames = response.data.dates.flatMap(date => {
          return date.games
        })
        console.log(arrayOfGames)
        weekMatches.value = arrayOfGames.map(game => {
          game.teams.away.sos = gameSOS(game.teams.away.team.id, arrayOfGames)
          game.teams.home.sos = gameSOS(game.teams.home.team.id, arrayOfGames)
          return game
        })
        players.value.forEach(player => {
          player.starting.forEach(game => {
            game.game_id = weekMatches.value.find(match => standardizeDate(match.gameDate) === standardizeDate(game.date)).gamePk
          })
        })

        let gamesPerTeam = response.data.dates.filter(date => {
          let day = new Date(date.date + 'T00:00:00')
          let today = new Date()
          today.setHours(0, 0, 0, 0)
          if (day >= today) {
            return date
          }
        }).flatMap(date => {
          return date.games
        }).reduce(function (sums, entry) {
          sums[entry.teams.home.team.name] = (sums[entry.teams.home.team.name] || 0) + 1;
          sums[entry.teams.away.team.name] = (sums[entry.teams.away.team.name] || 0) + 1;
          return sums
        }, {})

        teamGames.value = Object.keys(gamesPerTeam).map(team => {
          let id;
          arrayOfGames.some(game => {
            if (game.teams.home.team.name === team) {
              id = game.teams.home.team.id
            } else if (game.teams.away.team.name === team) {
              id = game.teams.away.team.id
            }
          })
          return {
            team: team,
            games: gamesPerTeam[team],
            id: id
          }
        }).map(team => {
          let teamGames = arrayOfGames.filter(game => {
            if (game.teams.away.team.name === team.team || game.teams.home.team.name === team.team) {
              return game
            }
          }).map(game => {
            if (game.teams.away.team.name === team.team) {
              return gameSOS(game.teams.home.team.id, arrayOfGames)
            } else if (game.teams.home.team.name === team.team) {
              return gameSOS(game.teams.away.team.id, arrayOfGames)
            }
          })
          let sosRating = teamGames.reduce((a, b) => { return a + b }) / teamGames.length
          team.sos = sosRating
          return team
        }).sort(compare)
        console.log(teamGames)
        playerAverages()
      }).catch((error) => {
        console.log('error', error)
      })
    }
    function gameSOS(opponent, games) {
      // Get Opponent's Schedule
      let opponentSchedule = games.filter(game => {
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
      let OOR = NHLStandings.value.filter(team => {
        if (allOpponents.includes(team.team.id)) {
          return team
        }
      }).map(team => {
        return team.pointsPercentage
      }).reduce(function (a, b) {
        return (a + b) / 2
      }, 0)
      let opponentRecord = NHLStandings.value.filter(team => {
        if (opponent === team.team.id) {
          return team
        }
      }).map(team => {
        return team.pointsPercentage
      })
      return ((2 * (opponentRecord)) + (OOR / allOpponents.length)) / 3
    }
    function findAvailableSpots() {
      let gameDays = gameDay.value.map(date => {
        return { day: date, roster: [{ position: "C", count: 2 }, { position: "RW", count: 2 }, { position: "LW", count: 2 }, { position: "D", count: 4 }, { position: "Util", count: 1 }, { position: "G", count: 2 }], teams: [] }
      }).map(date => {
        let games = weekMatches.value.filter(match => {
          if (new Date(date.day).setHours(0, 0, 0, 0) === new Date(match.gameDate).setHours(0, 0, 0, 0)) {
            return match
          }
        })
        date.teams = games.flatMap(game => {
          return [game.teams.home.team.name, game.teams.away.team.name]
        })
        players.value.filter(player => {
          if (player.status === undefined && player.averages.GAME_SCORE > 1.25) { // Player is actve
            if (games.some(game => game.teams.home.team.name === player.editorial_team_full_name || game.teams.away.team.name === player.editorial_team_full_name)) { // player is playing
              return player
            }
          }
        }).map(player => {
          let found = false
          for (const position of player.eligible_positions) {
            if (!found) {
              for (const roster_position of date.roster) {
                if (roster_position.position === position && roster_position.count > 0) {
                  found = true;
                  roster_position.count -= 1;
                  break;
                }
              }
            } else {
              break
            }
          }
        })
        return date
      })
      availableSpots.value = gameDays
    }
    function playerAverages() {
      let playerNames = players.value.map(player => player.name.full)
      let lastGameDayPlayed = weekMatches.value.findLast(game => game.status.detailedState === 'Final')
      getPlayerAverages({ name: playerNames }, 3, 'GAME_SCORE', parseInt(store.league.season + '020000'), lastGameDayPlayed.gamePk, true).then(response => {
        players.value = players.value.map(player => {
          let returnedPlayer = response.filter(APIPlayer => {
            if (player.name.full === APIPlayer.name) {
              return player
            }
          })[0]
          if (returnedPlayer !== undefined) {
            player.averages = returnedPlayer.averages
            player.previousGames = returnedPlayer.previousGames
          }
          return player
        })
        findAvailableSpots()
      })
    }
    onMounted(() => {
      if (parseInt(route.params.week_num) !== store.league.current_week) {
        getScoreBoard();
      } else {
        scoreboard.value = store.league.scoreboard.matchups
        gameDay.value = gameDays(scoreboard.value[0].week_start, scoreboard.value[0].week_end)
        getRoster()
      }
      getNHLStandings();
      getNHLSchedule();
    });
    return { store, route, players, weekMatches, scoreboard, gameDay, availableSpots, teamGames }
  },
  data() {
    return {
      roster: [{ position: "C", count: 2 }, { position: "RW", count: 2 }, { position: "LW", count: 2 }, { position: "D", count: 4 }, { position: "Util", count: 1 }, { position: "G", count: 2 }]
    }
  },
  methods: {
    projectedStat: function () {
      function compare(a, b) {
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
    getProjections() {
      let self = this

      // let dailyProjectionPromise = this.gameDays.map(day => {
      //   return getDailyProjection(day)
      // })
      // console.log(dailyProjectionPromise)
      // Promise.allSettled(dailyProjectionPromise).then(response => {
      //   console.log(response)
      // })
      // this.gameDays.forEach(date => {
      //   getDailyProjection(date).then((day) => {
      //     let projectedPlayers = day.filter(player => {
      //       let players = self.players.some(currentPlayer => {
      //         if (currentPlayer.name.full === player.Name) {
      //           return currentPlayer;
      //         }
      //       })
      //       if (players) {
      //         return players
      //       }
      //     })
      //     self.players.map(currentPlayer => {
      //       let player = projectedPlayers.filter(player => {
      //         if (player.Name === currentPlayer.name.full) {
      //           return player
      //         }
      //       })
      //       if (player.length > 0) {
      //         player = player.map(player => {
      //           player.PowerPlayPoints = player.PowerPlayAssists + player.PowerPlayGoals
      //           if (player.Games === 1){
      //             player.GoaltendingSavePercentage = player.GoaltendingSaves / (player.GoaltendingSaves + player.GoaltendingGoalsAgainst)
      //             player.GoaltendingGoalsAgainstAverage = player.GoaltendingGoalsAgainst
      //           }
      //           return player
      //         })
      //         if (currentPlayer.projections === undefined) {
      //           currentPlayer.projections = [player[0]]
      //         } else {
      //           currentPlayer.projections.push(player[0])
      //         }
      //       }
      //       return currentPlayer
      //     })
      //     // PROJECTED TOTALS
      //   })
      // })
    },
    replacements() {
      let self = this;
      let teams = this.players.map(player => player.name.full)
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
    today: function () {
      let today = new Date()
      return today.toISOString().split('T')[0]
    }
  }
}
</script>
