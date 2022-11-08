<template>
    <div>
      <router-link :to="{ name: 'Team', params: { game_id: $route.params.game_id, league_id: $route.params.league_id, team_id:team.team_id, week_num:store.league.current_week }}">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <img class="h-10 w-10 rounded-full" :src="logo" :alt="team.name">
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">
              <h4>{{team.name}}</h4>
            </div>
            <div v-for="manager in team.managers" :key="manager.manager_id" class="text-sm text-gray-500">
              {{manager.nickname}}
            </div>
          </div>
        </div>
      </router-link>
    </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'

export default {
  name: 'TeamProfile',
  data () {
    return { }
  },
  props: ['team'],
  setup() {
    const route = useRoute()
    const store = useStore()

    return { store, route }
  },
  computed: {
    logo: function () {
      return this.team.team_logos[0].url
    }
  }
}
</script>
