<template>
  <header class="bg-white shadow mb-10">
    <Navigation />
  </header>
</template>
<script>
import Navigation from './Navigation.vue';

import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'
export default {
  name: 'Header',
  setup() {
    const route = useRoute()
    const store = useStore()

    return { store, route }
  },
  data() {
    return {
      route: this.route.name,
      game_id: this.route.params.game_id,
      league_id: this.route.params.league_id
    }
  },
  components: {
    Navigation
  }
}
</script>
