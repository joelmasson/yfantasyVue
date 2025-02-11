<template>
    <div class="flex justify-start md:justify-center">
        <button data-modal-target="defaultModal" data-modal-toggle="defaultModal"
            class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button" @click="this.showModal = !this.showModal">
            Get Players with X games left
        </button>
    </div>
    <ReplacementsPopup v-if="showModal" @close="showModal = false" @addPlayer="addPlayer">
    </ReplacementsPopup>
</template>
<script>
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
        }
    },
    components: { ReplacementsPopup: defineAsyncComponent(() => import('./replacementsPopup.vue')) },
    mounted() {
        this.setMaxGamesLeft()
    }
}
</script>
