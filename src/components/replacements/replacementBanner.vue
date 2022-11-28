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
        }
    },
    props: ['availableSpots'],
    components: { ReplacementsPopup },
}
</script>
    