<script>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index.js'
import axios from 'axios'
export default {
    name: 'Login',
    setup() {
        const route = useRoute()
        const store = useStore()

        return { store, route }
    },
    computed: {
        game_id() {
            console.log(route)
            return this.$route.params.game_id
        }
    }
}
</script>
<template>
    <nav class="bg-gray-800">
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div class="relative flex items-center justify-between h-16">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <!-- Mobile menu button-->
                    <button
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <!-- Icon when menu is closed. -->
                        <!--
                        Heroicon name: menu

                        Menu open: "hidden", Menu closed: "block"
                    -->
                        <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <!-- Icon when menu is open. -->
                        <!--
                        Heroicon name: x

                        Menu open: "block", Menu closed: "hidden"
                    -->
                        <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                    <div class="flex-shrink-0 flex items-center">
                        <img class="block lg:hidden h-8 w-auto"
                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow">
                        <img class="hidden lg:block h-8 w-auto"
                            src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                            alt="Workflow">
                    </div>
                    <div class="hidden sm:block sm:ml-6">
                        <div class="flex space-x-4">
                            <!-- <router-link :to="{ name: 'League', game_id: $route.params.game_id}">League</router-link> -->
                            <!-- <Button v-on:click="login">Login</Button> -->
                        </div>
                        <ol class="list-reset flex" v-if="route.params.game_id">
                            <router-link :to="{ name: 'League', game_id: route.params.game_id }">{{store.league.name}}</router-link>
                            <li><span class="text-gray-500 mx-2"></span></li>
                            <router-link v-if="route.params.team_id" :to="{ name: 'Team', game_id: route.params.game_id, team_id:route.params.team_id }">{{store.league.name}}</router-link>
                            <a href='/api/login'
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</a>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>