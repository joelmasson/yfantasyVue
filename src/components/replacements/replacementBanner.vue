<template>
    <div class="flex justify-start md:justify-center">
        <button @click="getReplacements()">Get</button>
    </div>
    <ReplacementsPopup></ReplacementsPopup>
</template>
<script>
import { useStore } from '../../stores/index.js'
import ReplacementsPopup from './replacementsPopup.vue'
export default {
    name: 'ReplacementsBanner',
    setup() {
        const store = useStore()
        return { store }
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
                    return team.id
                }
            })
            // TODO: fetch players
        }
    },
    props: ['teamGames'],
    components: { ReplacementsPopup },
    computed: {
        teamIdsByNumberOfGames: function () {
            return this.teamGames.map(team => {
              
            })
        }
    }
}
</script>
    