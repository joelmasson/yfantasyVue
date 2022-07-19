<template>
    <header class="bg-white shadow mb-10">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">
          {{route.name}}
        </h1>
        <router-link :to="{ name: 'Players', params: { game_id: $route.params.game_id, league_id:$route.params.league_id }}">
          Players
        </router-link>
      </div>
    </header>
</template>
<script>
export default {
  name: 'Header',
}
</script>
