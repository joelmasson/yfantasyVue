<template>
    <div>
        <h4 class="text-4xl font-bold text-black">{{ score }}</h4>
        <p class="text-sm text-gray-500">{{ timeframe }}</p>
    </div>
</template>
<script>
export default {
    name: 'Game Score',
    props: ['amount', 'timeframe'],
    computed: {
        score: function () {
            return this.amount?.toFixed(2)
        }
    }
}
</script>