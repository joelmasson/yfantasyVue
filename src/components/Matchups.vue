<template>
  <section>
    <ul class="inline-flex" v-if="league.end_week">
      <li v-for="week in parseInt(league.end_week)" :key="week">
        <button
          class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          @click="updateCurrentWeek(week)">
          {{ week }}
        </button>
      </li>
    </ul>
    <ul class="flex flex-col items-center" v-if="league.scoreboard">
      <li v-for="(matchup, i) in league.scoreboard.matchups" :key="i" class="grid grid-cols-2">
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
      selectedWeek: 1
    }
  },
  methods: {
    updateCurrentWeek: function (value) {
      this.selectedWeek = value
      this.$emit('selectedWeek', this.selectedWeek)
    }
  }
}
</script>
