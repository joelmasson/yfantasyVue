<template>
  <div>
    <div class="flex flex-col space-y-10">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
        <div class="px-4 py-5 sm:px-6">
          <router-link :to="{ name:'Game', params: {game_id: game.game_id}}">
            <h2>{{game.name}} - {{game.season}}</h2>
          </router-link>
          <!-- <router-link :to="{ name:'League', params: {game_id: game.game_id, league_id:league.league_id}}">
            <div class="flex-shrink-0 h-10 w-10">
              <img class="h-10 w-10 rounded-full" :src="league.logo" :alt="league.name">
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              League: {{league.name}}
            </h3>
          </router-link> -->
        </div>
        <div class="border-t border-gray-200">
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" v-for="(league, i) in game.leagues" :key="i">
            <router-link :to="{ name:'League', params: {game_id: game.game_id, league_id:league.league_id}}" :key="league.league_id" :id="league.league_id">
              <div class="flex-shrink-0 h-10 w-10">
                <img class="h-10 w-10 rounded-full" :src="league.logo_url" :alt="league.name">
              </div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                League: {{league.name}}
              </h3>
            </router-link>
            <!-- <router-link v-for="team in league.teams" :key="team.team_id" :to="{ name:'Team', params: {game_id: game.game_id, league_id:league.league_id, team_id:team.team_id}}">
              <img :src="team.team_logo" />
              <h2>Team: {{team.name}}</h2>
            </router-link> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DashboardCard',
  data () {
    return {
      league: this.game.league
    }
  },
  props: ['game'],
  methods: {
    stringify: function (data) {
      return JSON.stringify(data)
    }
  }
}
</script>
