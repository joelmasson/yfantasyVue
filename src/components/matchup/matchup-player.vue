<template>
  <div class="flex justify-start md:justify-center">
    <div class="w-14" v-if="route.name === 'Team'">
      <button
        :class="['block text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800', player.selected ? `bg-red-700 hover:bg-red-800` : `bg-green-700 hover:bg-green-800`]"
        type="button" @click="togglePlayer(player)">
        {{ player.selected ? '-' : '+' }}
      </button>
    </div>
    <Profile :player="player" :team="fantasyTeam"></Profile>
    <div
      class="flex group rounded-lg mx-1 my-1 transition-all duration-300 cursor-pointer justify-center w-20 hover:shadow-lg hover-dark-shadow border-2"
      v-bind:class="rating(day)" v-for="(day, i) in games" :key="i">
      <!-- <span v-if="today" class="flex h-3 w-3 absolute -top-1 -right-1">
        <span
          class="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-purple-400 "></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-100"></span>
      </span> -->
      <div class="flex items-center px-4 py-4">
        <div class="text-center">
          <p class=" text-gray-900 group-hover:text-gray-100 text-sm transition-all duration-300">
            {{ day.match }}
          </p>
          <p class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 ">
            {{ day.score }}
          </p>
          <p class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 ">
            {{ day.stat }}
          </p>
        </div>
      </div>
      <div role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
    Tooltip content
    <div class="tooltip-arrow" data-popper-arrow></div>
</div>
    </div>
  </div>
</template>
<script>
import { useStore } from '../../stores/index.js'
import { useRoute } from 'vue-router';
import Profile from './../Profile.vue'

import standardizeDate from '../../utils/standardizeDate'

export default {
  name: 'MatchupPlayer',
  setup() {
    const route = useRoute()
    const store = useStore()
    return { store, route }
  },
  data() {
    return {

    }
  },
  props: ['player', 'dates', 'schedule'],
  components: { Profile },
  methods: {
    rating: (day) => {
      if(day.position === 'BN'){x
        return 'opacity-50'
      }
      // if (sos === null) {
      //   return 'hover:bg-grey-500 border-grey-500'
      // } else if (sos < 0.5) {
      //   return 'hover:bg-green-500 border-green-500'
      // } else if (sos < 0.575) {
      //   return 'hover:bg-yellow-500 border-yellow-500'
      // } else if (sos < 0.625) {
      //   return 'hover:bg-orange-500 border-orange-500'
      // } else if (sos < 0.7) {
      //   return 'hover:bg-red-500 border-red-500'
      // }
    },
    togglePlayer(player) {
      this.player.selected = !this.player.selected
      this.$emit('updatePlayer', player)
    },
  },
  computed: {
    today: function () {
      let today = new Date()
      return today.toISOString().split('T')[0]
    },
    games: function () {
      if (this.player.starting === undefined || this.player.previousGames.length === 0) {
        return this.player.starting
        return { date: day, match: day.match, score: '', stat: undefined }
      }
      return this.player.starting.map(day => {
        let playedGame = this.player.previousGames.find(game => game.gamePk === day.gamePk)
        if (playedGame === undefined) {
          return day
        }
        return {
          ...day,
          stat: playedGame !== undefined ? playedGame.GAME_SCORE.toFixed(2) : undefined
        }
      })
      return this.dates.map(date => {
        if (Object.keys(this.schedule).length === 0) {
          return { date: date, sos: null }
        }
        let gameDay = this.schedule.filter(match => {
          if (standardizeDate(date) === standardizeDate(match.gameDate)) {
            if (match.teams.home.team.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === this.player.editorial_team_full_name || match.teams.away.team.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === this.player.editorial_team_full_name)
              return match
          }
        })
        let sos = gameDay.map(match => {
          if (match.teams.home.team.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === this.player.editorial_team_full_name) {
            return match.teams.away.sos
          } else {
            return match.teams.home.sos
          }
        })[0]

        let displayedStat = gameDay.map(match => {
          let playedGame = this.player.previousGames.filter(game => game.gamePk === match.gamePk)
          if (playedGame.length === 1) {
            return playedGame[0].GAME_SCORE.toFixed(2)
          }
          if (match !== undefined) {
            if (match.teams.home.team.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === this.player.editorial_team_full_name) {
              return (this.player.averages.GAME_SCORE * (1 - match.teams.away.sos)).toFixed(2)
            } else if (match.teams.away.team.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === this.player.editorial_team_full_name) {
              return (this.player.averages.GAME_SCORE * (1 - match.teams.home.sos)).toFixed(2)
            }
          }
        })
        return { date: date, gameDay: gameDay[0], stat: displayedStat[0], sos: sos }
      })
    },
    fantasyTeam: function () {
      return this.store.getTeam(this.route.params.team_id)
    }
  }
}
</script>
