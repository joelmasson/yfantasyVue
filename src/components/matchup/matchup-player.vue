<template>
<div class="flex justify-start md:justify-center">
    <p class="text-xl content-center text-center p-2 m-auto w-20">{{player.position}}</p>
    <Profile :player="player.player"></Profile>
    <div class="flex group rounded-lg mx-1 my-1 transition-all duration-300 cursor-pointer justify-center w-20 hover:shadow-lg hover-dark-shadow border-2" v-bind:class="rating(day.sos)" v-for="(day, i) in player.player.games" :key="i">
        <span v-if="today" class="flex h-3 w-3 absolute -top-1 -right-1">
            <span class="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-purple-400 "></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-100"></span>
        </span>
        <div class="flex items-center px-4 py-4">
            <div class="text-center">
            <p class=" text-gray-900 group-hover:text-gray-100 text-sm transition-all duration-300">
                {{day.matchup}}
            </p>
            <p class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 " >
                {{day.score}}
            </p>
            <!-- <p v-if="date.displayedStat !== null" class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 " >
                {{chosenStat}} - {{date.displayedStat}}
            </p> -->
            <!-- <p v-else class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 " >
                -
            </p> -->
            </div>
        </div>
    </div>
</div>
</template>
<script>
import Profile from './../Profile.vue'
export default {
  name: 'MatchupPlayer',
  data () {
    return {
    }
  },
  props: ['player', 'chosenStat'],
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
    }
  }
}
</script>
