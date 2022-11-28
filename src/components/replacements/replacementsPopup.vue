<template>
    <div class="flex justify-start md:justify-center">
    </div>
</template>
<script>
import { useStore } from '../../stores/index.js'
export default {
    name: 'Replacements Popup',
    setup() {
        const store = useStore()
        return { store }
    },
    data() {
        return {
        }
    },
    props: ['player', 'dates', 'schedule'],
}
</script>
    