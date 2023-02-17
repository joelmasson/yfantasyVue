<template>
  <div>
    <div v-for="team in matchup.teams">
      <TeamProfile :team="team"></TeamProfile>
      <span>{{ score(team.team_key, matchup) }}</span>
      <MatchupProjectionWeek :settings="store.league.settings.stat_categories" :players="team.players" :schedule="games"
        :scoreboard="store.league.scoreboard.matchups" :team_id="team.team_id" :NHLStandings="NHLStandings">
      </MatchupProjectionWeek>
    </div>
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
  props: ['matchup', 'gameDays', 'games', 'teams', 'NHLStandings'],
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
