<template>
    <div>
      <TeamProfile :team="matchup.teams[0]" :settings="settings"></TeamProfile>
      <span>{{score(matchup.teams[0].team_key, matchup)}}</span>
      <span>{{score(matchup.teams[1].team_key, matchup)}}</span>
      <TeamProfile :team="matchup.teams[1]" :settings="settings"></TeamProfile>
    </div>
</template>
<script>
import TeamProfile from './TeamProfile.vue'
export default {
  name: 'MatchupHeader',
  components: {
    TeamProfile
  },
  props: ['matchup', 'settings', 'schedule'],
  methods: {
    score: (teamID, matchup) => {
      let ID = teamID
      let score = matchup.stat_winners.filter(team => {
        if (ID === team.stat_winner.winner_team_key) {
          return team
        }
      })
      return score.length
    }
  },
  data () {
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
