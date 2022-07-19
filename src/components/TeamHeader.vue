<template>
    <div>
        <Profile :data="team" :type="'team'" :settings="settings"></Profile>
    </div>
</template>
<script>
import Stats from './Stats.vue'
import Profile from './Profile.vue'
export default {
  name: 'TeamHeader',
  data () {
    return { }
  },
  components: {
    Stats, Profile
  },
  props: ['team', 'logo', 'location'],
  computed: {
    teamData: function () {
      return {
        'team_logo': this.team.team_logo,
        'name': this.team.name,
        'managers': this.team.managers
      }
    }
  }
}
</script>
