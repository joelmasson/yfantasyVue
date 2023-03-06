
<template>
  <section>
    <MatchupHeader :projections="true" :gameDays="gameDays" :games="games" :matchup="matchup"
      :NHLStandings="NHLStandings">
    </MatchupHeader>
    <Calender :dates="gameDays"></Calender>
    <div v-if="games.length > 0" v-for="team in matchup.teams">
      <MatchupTeam :gameDays="gameDays" :games="games" :team_id="team.team_id" @roster="getRoster">
      </MatchupTeam>
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
import { APINHLStandings } from '../services/statsapi'

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
      Axios.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=' + this.store.league.scoreboard.matchups[0].week_start + '&endDate=' + this.store.league.scoreboard.matchups[0].week_end).then((response) => {
        let games = response.data.dates.flatMap(date => {
          return date.games
        })
        self.games = games.map(game => {
          game.teams.away.sos = gameSOS(game.teams.away.team.id, games, self.NHLStandings)
          game.teams.home.sos = gameSOS(game.teams.home.team.id, games, self.NHLStandings)
          return game
        })
      })
    },
    getNHLStandings: function () {
      let standingsData = APINHLStandings().then(response => {
        this.NHLStandings = response.data.records.flatMap(date => {
          return date.teamRecords
        })
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
        let numericDay = '0' + strDate.getDate()
        numericDay = numericDay.slice(-2)
        let date = {
          'DOW': strDate.toString().substring(0, 3),
          'Num': strDate.getDate(),
          'today': strDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0),
          'date': strDate.getFullYear() + '-' + [strDate.getMonth() + 1] + '-' + numericDay
        }
        dates.push(date)
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
