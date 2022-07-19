<template>
    <section>
        <ul class="inline-flex">
          <li v-for="week in parseInt(standings.end_week)" :key="week">
            <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" @click="updateCurrentWeek(week)">
              {{week}}
            </button>
          </li>
        </ul>
        <router-link v-for="(matchup, i) in matchups" :key="i" :to="{ name:'Matchup', params: { game_id: $route.params.game_id, league_id:$route.params.league_id, week_num:matchup.week, matchup:matchup.teams[0].team_id+'-'+matchup.teams[1].team_id } }">
            <Matchup :matchup="matchup" :settings="standings"></Matchup>
        </router-link>
    </section>
</template>
<script>
import Matchup from './MatchupHeader.vue'

export default {
  name: 'Matchups',
  components: {
    Matchup
  },
  props: ['matchups', 'standings'],
  data () {
    return {
      selectedWeek: 1
    }
  },
  methods: {
    updateCurrentWeek: function (value) {
      console.log(value)
      this.selectedWeek = value
      this.$emit('selectedWeek', this.selectedWeek)
    }
  }
  // watch: {
  //   standings: {
  //     immediate: true,
  //     handler (standing, oldStandings) {
  //       this.updateCurrentWeek(standing.current_week)
  //     }
  //   }
  // }
}
</script>
