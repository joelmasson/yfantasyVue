<template>
  <div>
    <table class="min-w-full divide-y divide-gray-200" x-max="1">
      <thead>
        <tr>
          <th scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          </th>
          <th scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            v-for="(category, i) in categories" :key="i">
            {{ category.display_name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ title
          }}</td>
          <td v-for="(stat, i) in Object.values(statsData)" :key="i"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ stat }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Axios from 'axios'
import { useStore } from './../stores/index.js'
export default {
  name: 'Stats',
  props: [
    'statsData', 'categories', 'title'
  ]
}
</script>
