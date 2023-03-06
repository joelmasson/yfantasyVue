<template>
  <div class="w-36">
    <div class="flex items-center">
      <div class="flex-shrink-0 h-10 w-14">
        <img class="h-10 w-14 rounded-full" :src="headshot" :alt="name" />
      </div>
    </div>
    <div>
      <div class="ml-4">
        <div class="text-sm font-medium text-gray-900">
          <!-- <router-link :to="{ name: 'Player', params: { game_id: $route.params.game_id, player_id: id } }"> -->
          <h4>{{ name }}</h4>
          <!-- </router-link> -->
          <h5>{{ player.editorial_team_abbr }} - {{ positions }}</h5>
        </div>
        <div>
          <button type="button" @click="displayPlayerCard()"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">View
            Card</button>
        </div>
      </div>
      <div>
        <PlayerCard v-if="displayCard" :player="player" :team="team" @close="displayCard = false"></PlayerCard>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, defineAsyncComponent } from 'vue'
export default {
  components: { PlayerCard: defineAsyncComponent(() => import('./PlayerCard.vue')) },
  name: 'profile',
  data() {
    return {
      displayCard: false
    }
  },
  props: ['player', 'team', 'settings'],
  methods: {
    displayPlayerCard() {
      this.displayCard = !this.displayCard;
    }
  },
  computed: {
    id: function () {
      if (this.player.player_id === undefined) {
        return this.player.nhl_player_id;
      }
      return this.player.player_id
    },
    positions: function () {
      if (this.player.eligible_positions === undefined) {
        return ''
      }
      return this.player.eligible_positions.toString()
    },
    headshot: function () {
      if (this.player.image_url === undefined) {
        return ''
      }
      return 'https://' + this.player.image_url.split('https://')[2]
    },
    name: function () {
      if (this.player.name?.constructor === String) {
        return this.player.name
      }
      return this.player.name.full
    }
  }
}
</script>
