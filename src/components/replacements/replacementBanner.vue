<template>
    <div class="flex justify-start md:justify-center">
        <button data-modal-target="defaultModal" data-modal-toggle="defaultModal"
            class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button" @click="getPlayersWithMaxGamesLeft()">
            Get Players with X games left
        </button>
    </div>
    <ReplacementsPopup v-if="showModal" @close="showModal = false" :players='players' :dates="dates"
        :schedule="schedule">
    </ReplacementsPopup>
</template>
<script>
import { ref, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from '../../stores/index.js';
// import ReplacementsPopup from './replacementsPopup.vue';
import getPlayerAverages from '../../services/apiData';

const asyncModal = defineAsyncComponent(() => import('./replacementsPopup.vue'))


export default {
    name: 'ReplacementsBanner',
    setup() {
        const route = useRoute()
        const store = useStore()
        let players = ref([])
        return { store, route, players }
    }, data: function () {
        return {
            showModal: false
        }
    },
    methods: {
        getPlayersWithMaxGamesLeft() {
            this.showModal = true
            let games = this.teamGames[0].games
            let teamIds = this.teamGames.filter(team => {
                if (team.games === games) {
                    return team
                }
            }).map(team => team.id)
            let matchData = {
                fantasyTeamId: [null, this.store.league.league_key + '.t.' + this.route.params.team_id],
                position: ['Forward', 'Defenseman'],
                currentTeamId: teamIds
            }
            console.log(matchData)
            let lastGameDayPlayed = this.schedule.findLast(game => game.status.detailedState === 'Final')
            lastGameDayPlayed = lastGameDayPlayed === undefined ? parseInt(this.schedule[0].gamePk) - 1 : lastGameDayPlayed
            getPlayerAverages(matchData, 82, 'GAME_SCORE', this.store.league.season + '020000', lastGameDayPlayed.gamePk, true).then(response => {
                this.players = response
            })
        }
    },
    props: ['teamGames', 'schedule', 'dates'],
    components: { ReplacementsPopup: defineAsyncComponent(() => import('./replacementsPopup.vue')) }
}
</script>
