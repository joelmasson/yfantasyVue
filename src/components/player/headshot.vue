<template>
    <div class="flex items-center">
        <div class="flex-shrink-0 h-10 w-14">
            <img class="h-10 w-14 rounded-full" :src="headshot" :alt="alt" />
        </div>
    </div>
</template>
<script>
const defaultHeadshot = new URL('/src/assets/hockey-player.png', import.meta.url)
export default {
    name: 'Headshot',
    props: ['src', 'alt'],
    setup(props) {
        let headshot = defaultHeadshot.href
        return {
            headshot
        }
    },
    computed: {
        headshot: function () {
            return this.src === undefined ? headshot : 'https://' + this.src.split('https://')[2]
        }
    }
}
</script>