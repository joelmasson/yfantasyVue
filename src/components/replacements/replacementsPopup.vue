<template>
    <div id="defaultModal" tabindex="-1" aria-hidden="true"
        class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div class="relative w-full h-full max-w-2xl md:h-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Potential Players
                    </h3>
                    <button type="button" @click="$emit('close')"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="defaultModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-6 space-y-6">
                    <div v-for="(player, i) in playerlist" :key="i">
                        <button
                            :class="['block text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800', player.selected ? `bg-red-700 hover:bg-red-800` : `bg-green-700 hover:bg-green-800`]"
                            type="button" @click="addPlayer(player, i)">
                            {{ player.selected ? '-' : '+' }}
                        </button>
                        <Profile :player="player"></Profile>
                        {{ player.averages.GAME_SCORE }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { useStore } from '../../stores/index.js'
import Profile from './../Profile.vue'
export default {
    name: 'Replacements Popup',
    components: {
        Profile
    },
    setup() {
        const store = useStore()
        console.log(store.replacements)
        let playerlist = store.replacements === undefined ? [] : store.replacements
        return { store, playerlist }
    },
    data() {
        return {
            page: 0,
        }
    },
    methods: {
        addPlayer(player, i) {
            this.playerlist[i].selected = !this.playerlist[i].selected
            this.$parent.$emit('addPlayer', player)
        },
        setPlayerList() {
            let start = this.page * 20
            let finish = start + 19
            this.playerList = this.players.slice(start, finish)
        }
    },
    computed: {
        PPP() {
            console.log(this.state)
            return this.state.replacements
        }
    }
}
</script>
