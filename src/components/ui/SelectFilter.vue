<template>
    <label class="block text-left" style="max-width: 400px;">
        <span class="text-gray-700">{{label}}</span>
        <select class="form-select block w-full mt-1" v-model="model" @change="selected($event)">
            <option v-for="(option, i) in options" :key="i">{{option.name}}</option>
        </select>
    </label>
</template>
<script>
export default {
  name: 'SelectFilter',
  data () {
    return {
      model: this.default
    }
  },
  props: ['default', 'label', 'options'],
  methods: {
    selected: function (event) {
      console.log(event)
      this.$emit('updateSelectFilter', this.model)
    }
  }
}
</script>
