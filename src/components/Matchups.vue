<template>
  <section>
    <ul class="inline-flex" v-if="displayedScoreboard.end_week">
      <li v-for="week in parseInt(displayedScoreboard.end_week)" :key="week">
        <button
          class="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          :class="{ 'bg-blue-500': week === currentWeek }" @click="updateCurrentWeek(week)">
          {{ week }}
        </button>
      </li>
    </ul>
    <ul class="flex flex-col items-center" v-if="displayedScoreboard.scoreboard">
      <li v-for="(matchup, i) in displayedScoreboard.scoreboard.matchups" :key="i" class="grid grid-cols-2">
        <router-link
          :to="{ name: 'Matchup', params: { game_id: $route.params.game_id, league_id: $route.params.league_id, week_num: matchup.week, matchup: matchup.teams[0].team_id + '-' + matchup.teams[1].team_id } }">
          <MatchupHeader :matchup="matchup" :projections="false"></MatchupHeader>
        </router-link>
      </li>
    </ul>
  </section>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'
import MatchupHeader from './MatchupHeader.vue'

export default {
  name: 'Matchups',
  components: {
    MatchupHeader
  },
  props: ['league'],
  setup() {
    const route = useRoute()
    const store = useStore()

    return { store, route }
  },
  data() {
    return {
      displayedScoreboard: this.league,
      currentWeek: this.league.current_week
    }
  },
  methods: {
    updateCurrentWeek: async function (value) {
      if (value !== this.displayedScoreboard.current_week) {
        let data = await this.store.getYahooScoreBoard(this.route.params.game_id + '.l.' + this.route.params.league_id, value)
        this.displayedScoreboard = data
        this.currentWeek = value
      }
    }
  }
}
</script>
