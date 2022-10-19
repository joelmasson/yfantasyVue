<template>
    <header class="bg-white shadow mb-10">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">
          {{route}}
        </h1>
        <router-link v-if="game_id !== undefined && league_id !== undefined" :to="{ name: 'Players', params: { game_id: game_id, league_id:league_id }}">
          Players
        </router-link>
      </div>
    </header>
</template>
<script>
export default {
  name: 'Header',
  data () {
    return {
      route: this.$route.name,
      game_id: this.$route.params.game_id,
      league_id: this.$route.params.league_id
    }
  }
}
</script>
