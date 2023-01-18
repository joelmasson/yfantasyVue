<template>
<div class="flex justify-start md:justify-center">
    <!-- <p class="text-xl content-center text-center p-2 m-auto w-2">{{player.selected_position}}</p> -->
    <Profile :player="player"></Profile>
    <div class="flex group rounded-lg mx-1 my-1 transition-all duration-300 cursor-pointer justify-center w-20 hover:shadow-lg hover-dark-shadow border-2" v-bind:class="rating(day.sos)" v-for="(day, i) in games" :key="i">
      <span v-if="today" class="flex h-3 w-3 absolute -top-1 -right-1">
          <span class="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-purple-400 "></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-100"></span>
      </span>
      <div class="flex items-center px-4 py-4">
          <div class="text-center" v-if="day.gameDay !== undefined">
            <p class=" text-gray-900 group-hover:text-gray-100 text-sm transition-all duration-300">
                {{day.gameDay.matchup}}
            </p>
            <p class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 " >
                {{day.gameDay.teams.home.score}} - {{day.gameDay.teams.away.score}}
            </p>
            <p class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 " >
                {{day.stat}}
            </p>
            <!-- <p v-else class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 " >
                -
            </p> -->
          </div>
      </div>
    </div>
</div>
</template>
<script>
import { useStore } from '../../stores/index.js'
import Profile from './../Profile.vue'
import { statline } from '../../utils/index'
export default {
  name: 'MatchupPlayer',
  setup() {
    const store = useStore()
    return { store }
  },
  data () {
    return {
    }
  },
  props: ['player','dates','schedule'],
  components: {Profile},
  methods: {
    rating: function (sos) {
      if (sos < 0.5) {
        return 'hover:bg-green-500 border-green-500'
      } else if (sos < 0.575) {
        return 'hover:bg-yellow-500 border-yellow-500'
      } else if (sos < 0.625) {
        return 'hover:bg-orange-500 border-orange-500'
      } else if (sos < 0.7) {
        return 'hover:bg-red-500 border-red-500'
      }
    }
  },
  computed: {
    today: function () {
      let today = new Date()
      return today.toISOString().split('T')[0]
    },
    games: function() {
      return this.dates.map(date => {
        let gameDay = this.schedule.filter(match => {
          if(new Date(date).setHours(0,0,0,0) === new Date(match.gameDate).setHours(0,0,0,0)){
            if(match.teams.home.team.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")  === this.player.editorial_team_full_name || match.teams.away.team.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")  === this.player.editorial_team_full_name)
            return match
          }
        })
        let displayedStat = gameDay.map(match => {
          let playedGame = this.player.previousGames.filter(game => {
            if (game.gamePk === match.gamePk){
              return game
            }
          })
          if (playedGame.length === 1){
            return playedGame[0].GAME_SCORE.toFixed(2)
          }
          if (match !== undefined){
            if(match.teams.home.team.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")  === this.player.editorial_team_full_name){
              return (this.player.averages.GAME_SCORE * (1 -  match.teams.away.sos)).toFixed(2)
            } else if (match.teams.away.team.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")  === this.player.editorial_team_full_name){
              return (this.player.averages.GAME_SCORE * (1 -  match.teams.home.sos)).toFixed(2)
            }
          }
        })
        return {date:date, gameDay:gameDay[0], stat:displayedStat[0]}
      })
    }
  }
}
</script>
