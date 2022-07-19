import Stats from 'Stats'
<template>
    <div>
        <a v-if="modal" v-on:click="closeModal()">
            <span class="visually-hidden">Close Modal</span>
        </a>
        <img v-bind:src="player.portrait" />
        <div>
            <div>
                <h3>{{player.firstName}}<br/><span class="uppercase bold">{{player.lastName}}</span></h3>
                <h3 class="h2">{{player.position}}</h3>
            </div>
            <div v-if="showTeam">
                <img :src="player.originalTeam.logo" :alt="player.originalTeam.name" />
                <img :src="player.fantasyTeam.logo" :alt="player.fantasyTeam.name" />
            </div>
        </div>
        <Stats v-if="showStats" :stats="stats" ></Stats>
    </div>
</template>
<script>

export default {
  name: 'Card',
  data () {
    return {
      modal: false,
      showTeam: false,
      showStats: false,
      player: {
        portrait: '',
        firstName: 'Guy',
        lastName: 'LaFleur',
        position: 'C / LW',
        originalTeam: {
          logo: '',
          name: 'MTL'
        },
        fantasyTeam: {
          logo: '',
          name: 'SD'
        },
        stats: [
          {
            categoryName: 'Goals',
            value: '2'
          }
        ]
      }
    }
  },
  methods: {
    closeModal: function () {
      console.log('close')
    }
  }
}
</script>
