<template>
    <div>
        <td v-for="stat in row.stats" :key="stat.stat_id">
            {{stat.value}}
        </td>
    </div>
</template>
<script>
export default {
  name: 'StatsRow',
  data () {
    return {}
  },
  props: ['row']
}
</script>
