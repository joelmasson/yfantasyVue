<template>
    <div class="flex justify-start md:justify-center">
        <button data-modal-target="defaultModal" data-modal-toggle="defaultModal"
            class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button" @click="getPlayers()">
            Get Players with X games left
        </button>
    </div>
    <ReplacementsPopup v-if="showModal" @close="showModal = false" @addPlayer="addPlayer">
    </ReplacementsPopup>
</template>
<script>
import Axios from 'axios'

import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from '../../stores/index.js';

export default {
    name: 'ReplacementsBanner',
    props: ['teamGames', 'schedule', 'dates'],
    emits: ['addPlayer'],
    setup(props) {
        const route = useRoute()
        const store = useStore()
        let games = 0
        return { store, route }
    }, data: function () {
        return {
            showModal: false,
            loading: false,
            maxGamesLeft: 0,
        }
    },
    methods: {
        addPlayer(player) {
            this.$emit('addPlayer', player)
        },
        setMaxGamesLeft() {
            this.maxGamesLeft = this.teamGames === undefined ? 0 : this.teamGames[0]
        },
        getPlayers() {
            let self = this;
            this.showModal = !this.showModal;
            Axios.post('/api/yahoo/players/leagues', {
                league_key: '427.l.11426',
            // league_keys: self.route.game_id + '.l.' + self.route.league_id,
            filter: {status:'A',sort:'AR', sort_type:'average_season'},
            subresources: 'stats'
        })
            .then((response) => {
            console.log(response)
            // self.players = response.data[0].players
            // self.league = response.data[0]
            // self.updateStore()

            // get player stats from internal
            //
            })
            .catch((error) => {
            // self.updateStore()
            console.log(error)
            })
            // let games = this.teamGames[0].games
            // let teamIds = this.teamGames.filter((team) => {
            //     if (team.games === games) {
            //         return team;
            //     }
            // }).map((team) => team.id);
            // let lastGameDayPlayed = this.schedule.findLast(
            //     (game) => game.status.detailedState === "Final"
            // );
            // lastGameDayPlayed =
            //     lastGameDayPlayed === undefined
            //         ? parseInt(this.schedule[0].gamePk) - 1
            //         : lastGameDayPlayed;
            // if (this.store.replacements.players.length === 0) {
            //     this.store.getPlayersWithXGamesLeft(teamIds, this.store.league.league_key, this.route.params.team_id, lastGameDayPlayed, this.store.league.season)
            // } else {

            // }
        }
    },
    components: { ReplacementsPopup: defineAsyncComponent(() => import('./replacementsPopup.vue')) },
    mounted() {
        this.setMaxGamesLeft()
    }
}
</script>
