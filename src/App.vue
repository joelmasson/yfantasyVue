<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Navigation from './components/Navigation.vue';
import Header from './components/Header.vue';
</script>

<template>
  <div id="app" class="bg-gray-100 font-sans">
    <Navigation />
    <!-- <Header /> -->
    <div class="container mx-auto">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
