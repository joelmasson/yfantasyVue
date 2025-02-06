<template>
  <section>
    <MatchupHeader :projections="true" :gameDays="gameDays" :games="games" :matchup="matchup"
      :NHLStandings="NHLStandings" />
    <Calender :dates="gameDays" />
    <div v-if="games.length > 0" v-for="team in matchup.teams">
      <MatchupTeam :gameDays="gameDays" :games="games" :team_id="team.team_id" @roster="getRoster" />
    </div>
  </section>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'

import Calender from './calender/calender.vue'
import MatchupHeader from './MatchupHeader.vue'
import MatchupTeam from './matchup/matchup-team.vue'

import gameSOS from '../utils/strenghtOfSchedule'
import { APINHLStandings, APINHLSchedule } from '../services/nhl/nhlAPI'

// ui
import SelectFilter from './ui/SelectFilter.vue'
import Axios from 'axios'

export default {
  name: 'MatchupPage',
  components: {
    MatchupHeader, Calender, MatchupTeam, SelectFilter
  },
  setup() {
    const route = useRoute()
    const store = useStore()

    return { store, route }
  },
  data() {
    return {
      chosenStat: 'GAME_SCORE',
      playbyplays: [],
      proTeams: [],
      games: [],
      matchup: [],
      NHLStandings: [],
    }
  },
  methods: {
    getWeekGames: function () {
      let self = this
      APINHLSchedule(this.matchup.week_start).then((response) => {
        let games = response.data.gameWeek.flatMap(date => {
          return date.games
        })
        self.games = games.map(game => {
          game.awayTeam.sos = gameSOS(game.awayTeam.id, games, self.NHLStandings)
          game.homeTeam.sos = gameSOS(game.homeTeam.id, games, self.NHLStandings)
          return game
        })
      })
    },
    getNHLStandings: function () {
      APINHLStandings('now').then(response => {
        this.NHLStandings = response.data.standings
        this.getWeekGames()
      });
    },
    getRoster: function (playerData) {
      console.log(playerData)
      this.matchup.teams.forEach(team => {
        if (playerData.team_id === team.team_id) {
          team.players = playerData.players
        }
      })
    },
    getMatch: function () {
      let homeId = this.$route.params.matchup.split('-')[0]
      this.matchup = this.store.getMatch(homeId)
    }
  },
  computed: {
    gameDays() {
      let end = new Date(this.matchup.week_end + 'T00:00:00.000-04:00')
      end = new Date(end.setDate(end.getDate() + 1))
      let start = new Date(this.matchup.week_start + 'T00:00:00.000-05:00')
      let dates = []
      let dateMove = new Date(start)
      let strDate = start
      let today = new Date()
      while (strDate < end) {
        strDate = dateMove
        dates.push({
          'DOW': strDate.toString().substring(0, 3),
          'Num': strDate.getDate(),
          'today': strDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0),
          'date': new Date(strDate).toISOString().split('T')[0]
        })
        dateMove.setDate(dateMove.getDate() + 1)
      };
      return dates
    }
  },
  mounted() {
    this.getNHLStandings()
    this.getMatch()
    // this.getTeamPlayers()
  }
}
</script>
