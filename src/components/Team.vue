<template>
  <div class="bg-white shadow-md rounded-lg">
    <Replacements :teamGames="teamGames" :schedule="weekMatches" :dates="gameDay" @addPlayer="addPlayer">
    </Replacements>
    <WeekProjections :settings="store.league.settings.stat_categories" :players="projectedPlayers"
      :schedule="weekMatches" :scoreboard="scoreboard" :team_id="route.params.team_id"></WeekProjections>
    <div class="flex justify-start md:justify-center">
      <div class="w-36"></div>
      <div class="flex group mx-1 my-1 justify-center w-20" v-for="(day, i) in gameDay" :key="i">
        {{ day.split('-')[1] }} {{ day.split('-')[2] }}
      </div>
    </div>
    <MatchupPlayer v-if="players.length === 0" v-for="(player, i) in emptyRoster" :key="i" :player="player"
      :dates="gameDay" :schedule="weekMatches">
    </MatchupPlayer>
    <MatchupPlayer v-else v-for="player in players" :key="player.player_id" :player="player" :dates="gameDay"
      :schedule="weekMatches" @updatePlayer="updatePlayer">
    </MatchupPlayer>
  </div>
</template>
<script>
import { ref, onMounted, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'
import { gameDays } from '../utils/index.ts'
import { teamNamesAbv } from '../utils/teamNames'
import { getPlayerAverages, getWeekRoster } from '../services/apiData';
import standardizeDate from '../utils/standardizeDate'
import gameSOS from '../utils/strenghtOfSchedule'
import { APINHLStandings } from '../services/statsapi'

import Axios from 'axios'
import MatchupPlayer from './matchup/matchup-player.vue'
import WeekProjections from './team/weekProjections.vue'
import Replacements from './replacements/replacementBanner.vue'
export default {
  name: 'Team',
  components: {
    MatchupPlayer,
    WeekProjections,
    Replacements
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    let availableSpots = ref([])
    let scoreboard = ref(null)
    let gameDay = ref([])
    let players = ref([])
    let NHLStandings = {}
    let games = ref({})
    let weekMatches = ref({})
    let teamGames = ref({})
    let roster = ref([{ position: "C", count: 2 }, { position: "RW", count: 2 }, { position: "LW", count: 2 }, { position: "D", count: 4 }, { position: "Util", count: 1 }, { position: "G", count: 2 }],)
    let emptyRoster = ref(roster.value.flatMap(position => {
      let spot = {
        name: '',
        player_id: null,
        eligible_positions: position.position
      }
      let positionArray = []
      for (let index = 0; index < position.count; index++) {
        positionArray.push(spot);
      }
      return positionArray
    }))
    // store.getProjections()
    function getScoreBoard() {
      return Axios.post('/api/yahoo/league/scoreboard', {
        league_key: store.league.league_key,
        week: route.params.week_num
      }).then((response) => {
        scoreboard.value = response.data.scoreboard.matchups
        gameDay.value = gameDays(scoreboard.value[0].week_start, scoreboard.value[0].week_end)
      }).catch((error) => {
        console.log('error', error)
      })
    }
    function getRoster() {
      getWeekRoster(gameDay.value, route.params.game_id, route.params.league_id, route.params.team_id).then(data => {
        players.value = data
        games.value.forEach(game => {
          players.value.forEach(player => {
            if (player.editorial_team_full_name === game.teams.away.team.name || player.editorial_team_full_name === game.teams.home.team.name) {
              player.starting.forEach(gameDay => {
                if (standardizeDate(gameDay.date) === standardizeDate(game.gameDate)) {
                  gameDay.gamePk = game.gamePk
                  gameDay.status = game.status.detailedState
                  if (player.editorial_team_full_name === game.teams.away.team.name) {
                    gameDay.sos = game.teams.away.sos
                  } else if (player.editorial_team_full_name === game.teams.home.team.name) {
                    gameDay.sos = game.teams.home.sos
                  }
                }
              })
            }
          })
        })
        playerAverages()
        // getWeekSchedule()
      })
      // let startingLineupPromise = gameDay.value.map(date => {
      //   let day = new Date(date)
      //   let yyyy = day.getFullYear().toString()
      //   let mm = (day.getMonth() + 1)
      //   let dd = day.getDate().toString()
      //   return Axios.post('/api/yahoo/roster/players', {
      //     team_key: route.params.game_id + '.l.' + route.params.league_id + '.t.' + route.params.team_id,
      //     date: yyyy + '-' + mm + '-' + dd
      //   }).then((response) => {
      //     return response.data.roster
      //   })
      // })

      // Promise.allSettled(startingLineupPromise).then(response => {
      //   let roster = response[0].value.map(player => {
      //     return {
      //       ...player,
      //       active: true,
      //       averages: [],
      //       previousGames: [],
      //       starting: []
      //     }
      //   })
      //   response.forEach((day, i) => {
      //     roster.forEach(player => {
      //       let dayPlayer = day.value.filter(gamePlayer => {
      //         if (gamePlayer.player_id === player.player_id) {
      //           return gamePlayer
      //         }
      //       })
      //       if (dayPlayer.length > 0) {
      //         player.starting.push({ date: gameDay.value[i], position: dayPlayer[0].selected_position, game_id: '' })
      //       }
      //     })
      //   })
      //   players.value = roster
      //   getWeekSchedule()
      // })
    }
    function getNHLStandings() {
      let standingsData = APINHLStandings().then(response => {
        NHLStandings.value = response.data.records.flatMap(date => {
          return date.teamRecords
        })
        getgames();
      });
    }
    function getgames() {
      // Get all games
      Axios.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=' + store.league.scoreboard.matchups[0].week_start + '&endDate=' + store.league.scoreboard.matchups[0].week_end).then((response) => {
        let gameData = response.data.dates.flatMap(date => {
          return date.games
        })
        games.value = gameData.map(game => {
          game.teams.away.sos = gameSOS(game.teams.away.team.id, gameData, NHLStandings.value)
          game.teams.home.sos = gameSOS(game.teams.home.team.id, gameData, NHLStandings.value)
          return game
        })
        getRoster()
      }).catch((error) => {
        console.log('error', error)
      })
    }
    // function getWeekSchedule() {
    //   function compare(a, b) {
    //     if (a.games > b.games) {
    //       return -1
    //     }
    //     if (a.games < b.games) {
    //       return 1
    //     }
    //     return 0
    //   }
    //   Axios.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=' + store.league.scoreboard.matchups[0].week_start + '&endDate=' + store.league.scoreboard.matchups[0].week_end).then((response) => {
    //     let arrayOfGames = response.data.dates.flatMap(date => {
    //       return date.games
    //     })
    //     console.log(arrayOfGames)
    //     weekMatches.value = arrayOfGames.map(game => {
    //       game.teams.away.sos = gameSOS(game.teams.away.team.id, arrayOfGames)
    //       game.teams.home.sos = gameSOS(game.teams.home.team.id, arrayOfGames)
    //       return game
    //     })
    //     players.value.forEach(player => {
    //       player.starting.forEach(game => {
    //         game.game_id = weekMatches.value.find(match => standardizeDate(match.gameDate) === standardizeDate(game.date))?.gamePk
    //       })
    //     })

    //     let gamesPerTeam = response.data.dates.filter(date => {
    //       let day = new Date(date.date + 'T00:00:00')
    //       let today = new Date()
    //       today.setHours(0, 0, 0, 0)
    //       if (day >= today) {
    //         return date
    //       }
    //     }).flatMap(date => {
    //       return date.games
    //     }).reduce(function (sums, entry) {
    //       sums[entry.teams.home.team.name] = (sums[entry.teams.home.team.name] || 0) + 1;
    //       sums[entry.teams.away.team.name] = (sums[entry.teams.away.team.name] || 0) + 1;
    //       return sums
    //     }, {})

    //     teamGames.value = Object.keys(gamesPerTeam).map(team => {
    //       let id;
    //       arrayOfGames.some(game => {
    //         if (game.teams.home.team.name === team) {
    //           id = game.teams.home.team.id
    //         } else if (game.teams.away.team.name === team) {
    //           id = game.teams.away.team.id
    //         }
    //       })
    //       return {
    //         team: team,
    //         games: gamesPerTeam[team],
    //         id: id
    //       }
    //     }).map(team => {
    //       let teamGames = arrayOfGames.filter(game => {
    //         if (game.teams.away.team.name === team.team || game.teams.home.team.name === team.team) {
    //           return game
    //         }
    //       }).map(game => {
    //         if (game.teams.away.team.name === team.team) {
    //           return gameSOS(game.teams.home.team.id, arrayOfGames)
    //         } else if (game.teams.home.team.name === team.team) {
    //           return gameSOS(game.teams.away.team.id, arrayOfGames)
    //         }
    //       })
    //       let sosRating = teamGames.reduce((a, b) => { return a + b }) / teamGames.length
    //       team.sos = sosRating
    //       return team
    //     }).sort(compare)
    //     console.log(teamGames)
    //     playerAverages()
    //   }).catch((error) => {
    //     console.log('error', error)
    //   })
    // }
    // function gameSOS(opponent, games) {
    //   // Get Opponent's Schedule
    //   let opponentSchedule = games.filter(game => {
    //     if (game.teams.home.team.id === opponent) {
    //       return game
    //     } else if (game.teams.away.team.id === opponent) {
    //       return game
    //     }
    //   })
    //   // Get Opponent's Opponents Record
    //   let allOpponents = opponentSchedule.map(game => {
    //     if (game.teams.home.team.id === opponent) {
    //       return game.teams.away.team.id
    //     } else if (game.teams.away.team.id === opponent) {
    //       return game.teams.home.team.id
    //     }
    //   })
    //   let OOR = NHLStandings.value.filter(team => {
    //     if (allOpponents.includes(team.team.id)) {
    //       return team
    //     }
    //   }).map(team => {
    //     return team.pointsPercentage
    //   }).reduce(function (a, b) {
    //     return (a + b) / 2
    //   }, 0)
    //   let opponentRecord = NHLStandings.value.filter(team => {
    //     if (opponent === team.team.id) {
    //       return team
    //     }
    //   }).map(team => {
    //     return team.pointsPercentage
    //   })
    //   return ((2 * (opponentRecord)) + (OOR / allOpponents.length)) / 3
    // }
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
      let playerNames = [...players.value].map(player => player.name.full)
      let lastGameDayPlayed = games.value.findLast(game => game.status.detailedState === 'Final')
      lastGameDayPlayed = lastGameDayPlayed === undefined ? parseInt(weekMatches.value[0].gamePk) - 1 : lastGameDayPlayed
      getPlayerAverages({ name: playerNames }, 3, 'GAME_SCORE', parseInt(store.league.season + '020000'), lastGameDayPlayed.gamePk, true).then(response => {
        players.value = [...players.value].map(player => {
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
        // findAvailableSpots()
      })
    }
    onMounted(() => {
      if (parseInt(route.params.week_num) !== store.league.current_week) {
        getScoreBoard();
      } else {
        scoreboard.value = store.league.scoreboard.matchups
        gameDay.value = gameDays(scoreboard.value[0].week_start, scoreboard.value[0].week_end)
      }
      getNHLStandings();
    });
    return { store, route, players, games, weekMatches, scoreboard, gameDay, availableSpots, teamGames, roster, emptyRoster }
  },
  methods: {
    updatePlayer(updatedPlayer) {
      console.log(updatedPlayer)
      this.players.forEach(player => {
        if (player.player_id === updatedPlayer.player_id) {
          player.selected === updatedPlayer.selected
        }
      });
    },
    addPlayer(player) {
      let addedPlayer = player
      // let lastGameDayPlayed = this.games.findLast(game => game.status.detailedState === 'Final')
      // lastGameDayPlayed = lastGameDayPlayed === undefined ? parseInt(this.weekMatches[0].gamePk) - 1 : lastGameDayPlayed
      // getPlayerAverages({ name: [player.name] }, 3, 'GAME_SCORE', parseInt(this.store.league.season + '020000'), lastGameDayPlayed.gamePk, true).then(response => {
      //   // players.value = [...players.value].map(player => {
      //   //   let returnedPlayer = response.filter(APIPlayer => {
      //   //     if (player.name.full === APIPlayer.name) {
      //   //       return player
      //   //     }
      //   //   })[0]
      //   //   if (returnedPlayer !== undefined) {
      //   //     player.averages = returnedPlayer.averages
      //   //     player.previousGames = returnedPlayer.previousGames
      //   //   }
      //   //   return player
      //   // })
      //   // findAvailableSpots()

      //   player.starting = this.games.filter(game => {
      //     if (game)
      //   })
      //   player.previousGames = response[0].previousGames
      // })
      // this.players.push(player)
      console.log(player)
    }
  },
  computed: {
    today: function () {
      let today = new Date()
      return today.toISOString().split('T')[0]
    },
    projectedPlayers: function () {
      return this.players.filter(player => player.selected)
    }
  }
}
</script>
