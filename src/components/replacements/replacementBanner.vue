<template>
    <div class="flex justify-start md:justify-center">
        <button @click="getPlayersWithMaxGamesLeft()">Get</button>
    </div>
    <ReplacementsPopup></ReplacementsPopup>
</template>
<script>
import { useRoute } from 'vue-router';
import { useStore } from '../../stores/index.js';
import ReplacementsPopup from './replacementsPopup.vue';
import getPlayerAverages from '../../services/apiData';
export default {
    name: 'ReplacementsBanner',
    setup() {
        const route = useRoute()
        const store = useStore()
        return { store, route }
    },
    data() {
        return {
        }
    },
    methods: {
        getReplacements() {
            console.log('fetch')
        },
        getPlayersWithMaxGamesLeft() {
            let games = this.teamGames[0].games
            let teamIds = this.teamGames.filter(team =>{
                if(team.games === games){
                    return team
                }
            }).map(team => team.id)
            let matchData = {
                fantasyTeamId:[null, this.store.league.league_key + '.t.'+ this.route.params.team_id],
                position: ['Forward', 'Defenseman'],
                currentTeamId:teamIds
            }
            console.log(matchData)
            let lastGameDayPlayed = this.schedule.findLast(game => game.status.detailedState === 'Final')
            getPlayerAverages(matchData, 82, 'GAME_SCORE', this.store.league.season + '020000', lastGameDayPlayed.gamePk, true).then(response => {
                console.log(response)
            })
        }
    },
    props: ['teamGames','schedule'],
    components: { ReplacementsPopup }
}
</script>
    