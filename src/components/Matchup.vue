
<template>
    <section>
        <MatchupHeader :matchup="getMatch" :settings="settings" :schedule="weeklySchedule"></MatchupHeader>
        <Calender :dates="weeklySchedule"></Calender>
        <!-- <SelectFilter :default="chosenStat" :label="'Sort by Stat'" :options="settings" @updateSelectFilter="updateFilter"></SelectFilter> -->
        <!-- <MatchupTeam :games="weeklySchedule" :chosenStat="chosenStat" :team_id="getMatch.teams[0].team_id" :teams="proTeams" :settings="settings"></MatchupTeam>
        <MatchupTeam :games="weeklySchedule" :chosenStat="chosenStat" :team_id="getMatch.teams[1].team_id" :teams="proTeams" :settings="settings"></MatchupTeam> -->
        <!-- <p v-else>LOADING PLAY BY PLAY DATA...</p> -->
        <!-- <Team v-for="team in getMatch.teams" :key="team.team_id" :teamID="team.team_id" :projections="projections"></Team> -->
    </section>
</template>
<script>
import Calender from './calender/calender.vue'
import MatchupHeader from './MatchupHeader.vue'
import MatchupTeam from './matchup/matchup-team.vue'
import TeamProfile from './TeamProfile.vue'
import Team from './Team.vue'

// ui
import SelectFilter from './ui/SelectFilter.vue'
import Axios from 'axios'

export default {
  name: 'Matchup',
  components: {
    MatchupHeader, TeamProfile, Team, Calender, MatchupTeam, SelectFilter
  },
  data () {
    return {
      settings: this.$store.state.categories,
      defaultStat: this.$store.state.categories[0],
      chosenStat: 'GAME_SCORE',
      playbyplays: [],
      proTeams: [],
      schedule: []
    }
  },
  methods: {
    // getPlaybyPlays: function () {
    //   let self = this
    //   let end = new Date(self.weeklySchedule[self.weeklySchedule.length - 1].date)
    //   end = new Date(end.setDate(end.getDate() + 3))
    //   end = end.getFullYear() + '-' + [end.getMonth() + 1] + '-' + end.getDate()
    //   // console.log(end)
    //   Axios.post('/api/playbyplay/', {
    //     action: 'internal',
    //     start: self.weeklySchedule[0].date,
    //     end: end
    //   }).then((response) => {
    //     console.log('pbp', response.data)
    //     self.playbyplays = response.data
    //     self.setGames()
    //   }).catch((error) => {
    //     console.log('error', error)
    //   })
    // },
    getProTeams: function () {
      let self = this
      console.log('teams')
      Axios.get('/api/team/all')
        .then(response => {
          self.proTeams = response.data
          // self.getPlaybyPlays()
        }).catch(err => {
          console.log(err)
        })
    },
    // setGames: function () {
    //   let schedule = this.weeklySchedule.map(day => {
    //     day.games = this.playbyplays.filter(game => {
    //       let gameDay = new Date(game.timestamp)
    //       let numericDay = '0' + gameDay.getDate()
    //       numericDay = numericDay.slice(-2)
    //       let GD = gameDay.getFullYear() + '-' + [gameDay.getMonth() + 1] + '-' + numericDay
    //       if (GD === day.date) {
    //         game.home = this.proTeams.filter(proTeam => {
    //           if (parseInt(proTeam.id) === parseInt(game.home)) {
    //             return proTeam
    //           }
    //         })[0]
    //         game.away = this.proTeams.filter(proTeam => {
    //           if (parseInt(proTeam.id) === parseInt(game.away)) {
    //             return proTeam
    //           }
    //         })[0]
    //         return game
    //       }
    //     })
    //     return day
    //   })
    //   this.schedule = schedule
    // },
    updateFilter: function (value) {
      this.chosenStat = value
    }
  },
  computed: {
    getMatch () {
      let homeId = this.$route.params.matchup.split('-')[0]
      return this.$store.getters.getMatch(homeId)
    },
    weeklySchedule () {
      let end = new Date(this.getMatch.week_end + 'T00:00:00.000-04:00')
      end = new Date(end.setDate(end.getDate() + 1))
      let start = new Date(this.getMatch.week_start + 'T00:00:00.000-05:00')
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
      console.log(dates)
      return dates
    }
  },
  mounted () {
    this.getProTeams()
    this.$store.dispatch('getStateData')
  }
}
</script>
