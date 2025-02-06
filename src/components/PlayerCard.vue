<template>
  <div>
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <button type="button" @click="$emit('close')"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="defaultModal">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <Headshot :src="player.image_url" :alt="player.name.full"></Headshot>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  {{ player.name.full }}
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
                    <router-link v-if="team !== undefined" :to="{
                      name: 'Team',
                      params: {
                        game_id: $route.params.game_id,
                        league_id: $route.params.league_id,
                        team_id: team.team_id,
                      },
                    }">
                      {{ team.name }}
                    </router-link>
                    <span v-else>Free Agent</span>
                    <!-- <span>{{ player.percent_owned[1].value }}% Ownership</span> -->
                  </p>
                </div>
              </div>
              <div>
                <h4 class="text-4xl font-bold text-black" v-if="player.averages.GAME_SCORE">{{ player.averages.GAME_SCORE.toFixed(2) }}</h4>
                <p class="text-sm text-gray-500">Game Score this week</p>
              </div>
            </div>
          </div>
          <div class="w-full p-2">
            <TabGroup>
              <TabList class="flex space-x-1 rounded-xl bg-blue-900 p-1">
                <Tab v-slot="{ selected }">
                  <button
                    :class="['w-full rounded-lg p-2.5 text-sm font-medium leading-5 text-blue-700', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2', selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',]">
                    Stats
                  </button>
                </Tab>
                <Tab v-slot="{ selected }">
                  <button
                    :class="['w-full rounded-lg p-2.5 text-sm font-medium leading-5 text-blue-700', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2', selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',]">
                    Averages
                  </button>
                </Tab>
                <Tab v-slot="{ selected }">
                  <button
                    :class="['w-full rounded-lg p-2.5 text-sm font-medium leading-5 text-blue-700', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2', selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',]">
                    Projections
                  </button>
                </Tab>
              </TabList>
              <TabPanels class="mt-2">
                <TabPanel
                  :class="['', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',]">
                  <p>Totals</p>
                  <Stats :statsData='stats' :categories='categories' :title="'Current Season'"></Stats>
                  <p>Games</p>
                  <Stats :statsData='stats' :categories='categories' :title="'Current Season'"></Stats>
                </TabPanel>
                <TabPanel
                  :class="['', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',]">
                  <Stats :statsData='averageStats' :categories='categories' :title="'Last 3 Games'"></Stats>
                </TabPanel>
                <TabPanel
                  :class="['', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',]">
                  <Stats :statsData='projectedStats' :categories='categories' :title="'This Week'"></Stats>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
import { ref } from 'vue'
import { useStore } from './../stores/index.js'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import Headshot from './player/headshot.vue'
import Stats from './Stats.vue'
import { StatLine, YahooCategoryToAPIStat, PlayersProjection, TeamAbbvYahooToNHL, TeamNHLIdtoAbbv } from './../utils/index'
import { APINHLSchedule } from '../services/statsapi'
import { getPlayerStats } from '../services/apiData'
export default {
  name: 'PlayerCard',
  components: {
    TabGroup, TabList, Tab, TabPanels, TabPanel, Stats, Headshot
  },
  setup(props) {
    const store = useStore()
    let stats = ref([])
    let seasonGames = ref([])
    let seasonStats = ref([])
    let season = store.league.season + (parseInt(store.league.season) + 1)
    let teamId = TeamAbbvYahooToNHL(props.player.editorial_team_abbr)
    APINHLSchedule(teamId, season).then(response => {
      seasonGames.value = response.data.dates.reverse().map(day => {
        let opponent = '';
        if (teamId === day.games[0].teams.away.team.id) {
          opponent = '@' + TeamNHLIdtoAbbv(day.games[0].teams.home.team.id)
        } else if (teamId === day.games[0].teams.home.team.id) {
          opponent = TeamNHLIdtoAbbv(day.games[0].teams.away.team.id)
        }
        return {
          opponent: opponent,
          gamePk: day.gamePk,
          date: day.gameDate
        }
      })
      console.log(seasonGames.value)
      getPlayerStats({ name: props.player.name.full }, parseInt(store.league.season + '020000'), seasonGames.value[0].gamePk).then(response => {
        console.log(response)
        // seasonStats = seasonGames.value.map(day => {
        // let gameDayStats = response.find(statGame => statGame.gamePK === day.gamePk)
        // if (gameDayStats !== undefined) {
        //   return {
        //     ...day,
        //     stats: store.getCategories(props.player.position_type).map(category => '-')
        //   }
        // } else {
        //   return {
        //     ...day,
        //     stats: store.getCategories(props.player.position_type).map(category => {
        //       return YahooCategoryToAPIStat(category.name, gameDayStats)?.toFixed(2)
        //     })
        //   }
        // }
        // })
      })
    })
    return { store, stats, seasonGames, seasonStats }
  },
  props: ['player', 'team'],
  computed: {
    categories: function () {
      return this.store.getCategories(this.player.position_type)
    },
    averageStats: function () {
      return this.categories.map(category => {
        return YahooCategoryToAPIStat(category.name, this.player.averages)?.toFixed(2)
      })
    },
    projectedStats: function () {
      return PlayersProjection([this.player], this.categories).map(stat => stat.value)
    },
    playerStats: function () {
      let lastGameDayPlayed = games.value.findLast(game => game.status.gameState === 'OFF')
      lastGameDayPlayed = lastGameDayPlayed === undefined ? parseInt(games.value[0].gamePk) - 1 : lastGameDayPlayed
      return
    }
  },
  methods: {
    getPlayer: function () {
      let self = this
      Axios.post('/api/yahoo/player/stats', {
        player_key: this.player.editorial_player_key
      }).then((response) => {
        self.stats = StatLine(this.categories, response.data.stats.stats).map(stat => {
          return stat.value
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    onClickButton(event) {
      this.$emit('clicked', 'someValue')
    }
  },
  mounted() {
    if (this.player.stats.length === 0) {
      this.getPlayer()
    } else {
      this.stats = this.player.stats
    }
  }
}
</script>
