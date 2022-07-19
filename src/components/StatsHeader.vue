<template>
    <ul>
        <li v-for="stat in statCategories" :key="stat.id">
            <a v-on:click="updateFilter()">

            </a>
        </li>
    </ul>
</template>
<script>
export default {
  name: 'StatsHeader',
  data () {
    return {

    }
  }
}
</script>
