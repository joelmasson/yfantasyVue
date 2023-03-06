<template>
  <div v-for="(team, i) in matchup.teams" class="grid px-6 py-4 whitespace-nowrap items-center justify-end"
    style="grid-template-columns: 0fr 0fr;" :style="i === 1 ? 'direction:rtl;' : ''">
    <TeamProfile :team="team"></TeamProfile>
    <span class="mx-4">{{ score(team.team_key, matchup) }}</span>
    <MatchupProjectionWeek v-if="projections" :settings="store.league.settings.stat_categories" :players="team.players"
      :schedule="games" :scoreboard="store.league.scoreboard.matchups" :team_id="team.team_id"
      :NHLStandings="NHLStandings">
    </MatchupProjectionWeek>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'

import TeamProfile from './TeamProfile.vue'
import MatchupProjectionWeek from './matchup/matchup-projection-week.vue'

export default {
  name: 'MatchupHeader',
  components: {
    TeamProfile,
    MatchupProjectionWeek
  },
  setup() {
    const route = useRoute()
    const store = useStore()

    return { store, route }
  },
  props: ['matchup', 'gameDays', 'games', 'teams', 'NHLStandings', 'projections'],
  methods: {
    score: (teamID, matchup) => {
      console.log()
      let ID = teamID
      let score = matchup.stat_winners.filter(team => {
        if (ID === team.stat_winner.winner_team_key) {
          return team
        }
      })
      return score.length
    }
  },
  data() {
    return {
      home: {
        score: 0
      },
      away: {
        score: 0
      }
    }
  }
}
</script>
