<template>
  <div id="wrapper" class="max-w-xl px-4 py-4 mx-auto">
    <div class="sm:grid sm:h-32 sm:grid-flow-row sm:gap-4 sm:grid-cols-3">
      <div
        id="jh-stats-positive" class=" flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded">
        <div>
          <div>
            <p class="flex items-center justify-end text-green-500 text-md">
              <span class="font-bold">6%</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24" >
                <path class="heroicon-ui" d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z" />
              </svg>
            </p>
          </div>
          <p class="text-3xl font-semibold text-center text-gray-800">43</p>
          <p class="text-lg text-center text-gray-500">Last GS</p>
        </div>
      </div>

      <div id="jh-stats-negative" class=" flex flex-col justify-center px-4 py-4 mt-4 bg-white border border-gray-300 rounded sm:mt-0 ">
        <div>
          <div>
            <p class="flex items-center justify-end text-red-500 text-md">
              <span class="font-bold">6%</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24" >
                <path class="heroicon-ui" d="M20 9a1 1 0 012 0v8a1 1 0 01-1 1h-8a1 1 0 010-2h5.59L13 10.41l-3.3 3.3a1 1 0 01-1.4 0l-6-6a1 1 0 011.4-1.42L9 11.6l3.3-3.3a1 1 0 011.4 0l6.3 6.3V9z" />
              </svg>
            </p>
          </div>
          <p class="text-3xl font-semibold text-center text-gray-800">43</p>
          <p class="text-lg text-center text-gray-500">Last 3 GS</p>
        </div>
      </div>

      <div id="jh-stats-neutral" class=" flex flex-col justify-center px-4 py-4 mt-4 bg-white border border-gray-300 rounded sm:mt-0 " >
        <div>
          <div>
            <p class="flex items-center justify-end text-gray-500 text-md">
              <span class="font-bold">0%</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24" >
                <path class="heroicon-ui" d="M17 11a1 1 0 010 2H7a1 1 0 010-2h10z" />
              </svg>
            </p>
          </div>
          <p class="text-3xl font-semibold text-center text-gray-800">43</p>
          <p class="text-lg text-center text-gray-500">Season GS</p>
        </div>
      </div>
    </div>
    <div class=" flex bg-white shadow-md justify-start md:justify-center rounded-lg overflow-x-scroll mx-auto py-4 px-2 ">
      <div class="flex group  rounded-lg mx-1 transition-all duration-300 cursor-pointer justify-center w-16" v-bind:class="{'bg-purple-600 shadow-lg dark-shadow':day.today, 'hover:bg-purple-500 hover:shadow-lg hover-dark-shadow':!day.today}" v-for="(day, i) in gameDays" :key="i">
        <span v-if="day.today" class="flex h-3 w-3 absolute -top-1 -right-1">
          <span class="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-purple-400 "></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-100"></span>
        </span>
        <div class="flex items-center px-4 py-4">
          <div class="text-center">
            <p class=" text-gray-900 group-hover:text-gray-100 text-sm transition-all duration-300">
              {{day.DOW}}
            </p>
            <p class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 " >
              {{day.Num}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Axios from 'axios'
export default {
  name: 'Projections',
  data () {
    return {
      playByPlays: [],
      gameScore: {
        last: 0,
        last3: 0,
        season: 0
      }
    }
  },
  props: ['player'],
  computed: {
    gameDays: function () {
      if (Object.keys(this.$store.state.league).length !== 0) {
        let DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        let firstMatch = this.$store.state.league.scoreboard.matchups[0]
        for (var arr = [], dt = new Date(firstMatch.week_start); dt <= new Date(firstMatch.week_end); dt.setDate(dt.getDate() + 1)) {
          let day = new Date(dt)
          let today = new Date()
          let date = {
            'DOW': DOW[day.getDay()],
            'Num': day.getDate(),
            'today': day.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
          }
          arr.push(date)
        }
        return arr
      } else {
        return []
      }
    }
  },
  methods: {
    setLeagueData: function () {
      if (Object.keys(this.$store.state.league).length === 0) {
        this.$store.dispatch('getYahooLeague', {game_id: 403, league_id: 3898, team_id: 1, week: 1})
      }
      this.getGameScore()
    },
    getGameScore: function () {
      function compare (a, b) {
        if (a.coverage_value < b.coverage_value) {
          return -1
        }
        if (a.coverage_value > b.coverage_value) {
          return 1
        }
        return 0
      }
      let currentSeason = this.player.stats.filter(stat => {
        let season = stat.coverage_value.substring(0, 4)
        if (stat.coverage_type === 'Game' && season === this.$store.state.league.season) {
          return stat
        }
      })
      currentSeason.sort(compare)
      currentSeason.forEach(season => {
        console.log(season)
      })
      let gameStats = {}
      currentSeason[0].stats.forEach((stat, i) => {
        gameStats[stat.stat_id] = parseInt(stat.value)
      })
      this.gameScore.last = this.calcGameScore(gameStats, 1)

      let gameStats3 = {}
      for (let index = 0; index < 3; index++) {
        currentSeason[index].stats.forEach((stat, i) => {
          if (gameStats3[stat.stat_id] === undefined) {
            gameStats3[stat.stat_id] = parseInt(stat.value)
          } else {
            gameStats3[stat.stat_id] = gameStats3[stat.stat_id] + parseInt(stat.value)
          }
        })
      }
      this.gameScore.last3 = this.calcGameScore(gameStats3, 3)

      let gameStatsSeason = {}
      for (let index = 0; index < currentSeason.length; index++) {
        currentSeason[index].stats.forEach((stat, i) => {
          if (gameStatsSeason[stat.stat_id] === undefined) {
            gameStatsSeason[stat.stat_id] = parseInt(stat.value)
          } else {
            gameStatsSeason[stat.stat_id] = gameStatsSeason[stat.stat_id] + parseInt(stat.value)
          }
        })
      }
      this.gameScore.season = this.calcGameScore(gameStatsSeason, currentSeason.length)
    },
    corsiFor: function (stats) {
      return stats.ON_ICE_SHOT + stats.ON_ICE_SHOT_BLOCKED + stats.ON_ICE_SHOT_MISSED
    },
    corsiAgainst: function (stats) {
      return stats.ON_ICE_SAVE + stats.ON_ICE_BLOCKED_SHOT + stats.ON_ICE_MISSED_SHOT
    },
    calcGameScore: function (stats, numOfGames) {
      console.log(numOfGames)
      return ((0.75 * stats.GOAL) + (0.7 * stats.ASSIST) + (0.55 * stats.ASSIST) + (0.075 * stats.SHOT) + (0.05 * stats.SHOT) + (0.15 * stats.PENALTY_AGAINST) - (0.15 * stats.PENALTY_FOR) + (0.01 * stats.FACEOFF_WIN) - (0.01 * stats.FACEOFF_LOSS) + (0.05 * this.corsiFor(stats)) - (0.05 * this.corsiAgainst(stats)) + (0.15 * stats.ON_ICE_GOAL) - (0.15 * stats.ON_ICE_GOAL_ALLOWED)) / numOfGames
    }
  },
  mounted () {
    this.setLeagueData()
    // this.getProjection('sps-3')
  }
}
</script>
