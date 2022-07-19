<template>
  <div>
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <img
                  class="h-10 w-14 rounded-full"
                  :src="player.image_url"
                  :alt="player.name.full"
                />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  {{ player.name.full }}
                  <span v-if="player.is_undroppable !== 0">UD</span>
                  <span> FAV </span>
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <span>{{ player.display_position }}</span>
                    <span>{{ player.editorial_team_full_name }}</span>
                    <span v-if="player.status !== undefined">{{
                      player.status
                    }}</span>
                    <span v-else>#{{ player.uniform_number }}</span>
                  </p>
                </div>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <router-link
                      v-if="team !== undefined"
                      :to="{
                        name: 'Team',
                        params: {
                          game_id: $route.params.game_id,
                          league_id: $route.params.league_id,
                          team_id: team.team_id,
                        },
                      }"
                    >
                      {{ team.name }}
                    </router-link>
                    <span v-else>Free Agent</span>
                    <span>{{ player.percent_owned[1].value }}% Ownership</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
          ></div>
        </div>
      </div>
    </div>

    <!-- <div v-if="action !== null">
            <button v-if="action === 'add'" v-on:click="addPLayer(player)">ADD</button>
            <button v-if="action === 'drop'" v-on:click="dropPLayer(player)">DROP</button>
            <button v-if="action === 'trade'" v-on:click="tradePLayer(player)">TRADE</button>
        </div> -->
    <button v-if="compare" v-on:click="comparePLayer(player)">Compare</button>
  </div>
</template>
<script>
import Axios from 'axios'
export default {
  name: 'PlayerCard',
  data () {
    return {
      playerData: {}
    }
  },
  props: ['player', 'team'],
  computed: {
    playerMeta: function () {
      return {}
    }
  },
  methods: {
    getPlayer: function () {
      Axios.get('/api/yahoo/players/fetch', {
        players: [this.player.editorial_player_key],
        subresources: ['stats', 'percent_owned', 'draft_analysis']
      })
        .then((response) => {
          console.log(JSON.stringify(response.data))
          self.$set(this, 'playerData', response)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onClickButton (event) {
      this.$emit('clicked', 'someValue')
    }
  },
  mounted () {
    this.getPlayer()
  }
}
</script>
