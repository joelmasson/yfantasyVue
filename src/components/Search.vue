<template>
    <div>
        <label id='player-search-label' for="player-search" tabindex="-1" class="block text-sm font-medium text-gray-700">Search</label>
        <input v-model="searchVal" autocomplete="off" type="text" size="" title="player search" id="player-search" name="player-search" spellcheck="false" aria-labelledby="player-search-label" placeholder="Search by player name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
        <button type="button" v-on:click="searchForPlayers" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">GO</button>
    </div>
</template>
<script>
export default {
  name: 'Search',
  data () {
    return {
      searchVal: ''
    }
  },
  methods: {
    searchForPlayers: function () {
      this.$emit('query', this.searchVal)
    }
  }
}
</script>
