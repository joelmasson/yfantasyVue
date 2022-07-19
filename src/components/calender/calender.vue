<template>
  <div>
    <div class="flex bg-white shadow-md justify-start md:justify-center rounded-lg overflow-x-scroll mx-auto py-4 px-2 ">
      <div class="flex group  rounded-lg mx-1 transition-all duration-300 cursor-pointer justify-center w-16" v-bind:class="{'bg-purple-600 shadow-lg dark-shadow':day.today, 'hover:bg-purple-500 hover:shadow-lg hover-dark-shadow':!day.today}" v-for="(day, i) in dates" :key="i">
        <span v-if="today" class="flex h-3 w-3 absolute -top-1 -right-1">
          <span class="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-purple-400 "></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-100"></span>
        </span>
        <div class="flex items-center px-4 py-4">
          <div class="text-center">
            <p class=" text-gray-900 group-hover:text-gray-100 text-sm transition-all duration-300">
              {{day.DOW}}
            </p>
            <p class=" text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300 " >
              {{day.Num}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Axios from 'axios'
export default {
  name: 'Calender',
  data () {
    return {
    }
  },
  props: ['dates'],
  computed: {
    today: function () {
      let today = new Date()
      return today.toISOString().split('T')[0]
    }
  }
}
</script>
