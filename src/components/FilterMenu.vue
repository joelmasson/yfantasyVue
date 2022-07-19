<template>
  <div>
    <label for="filter-status">Status</label>
    <select name="filter-status" id="filter-status" v-model="statusFilter">
      <option value="A">All Available</option>
      <option value="FA">Free Agents</option>
      <option value="W">Waivers</option>
      <option value="T">Taken</option>
      <option value="K">Keepers</option>
      <option v-for="team in teams" :key="'team_'+team.team_id" :value="team.team_id">{{team.name}}</option>
      <option v-for="team in proTeams" :key="'proTeam_'+team.team_id" :value="team.team_id">{{team.team_name}}</option>
    </select>
    <label for="filter-position">Position</label>
    <select name="filter-position" id="filter-position" v-model="positionFilter">
      <option value="P">All Forwards / Defencemen</option>
      <option v-for="(position, i) in positions" :key="'p_'+i" :value="position.position">{{position.position}}</option>
    </select>
    <label for="filter-stats">Stats</label>
    <select
      name="stat1"
      id="filter-stats"
      v-model="statsFilter"
    >
      <optgroup label="Current Season Stats">
        <option :value="'S_S'+year">Season (total)</option>
        <option :value="'S_AS_'+year">Season (avg)</option>
        <!-- <option value="S_SD_2019">Season (std dev)</option> -->
        <option value="S_L">Today (live)</option>
        <option value="S_L30">Last 30 Days (total)</option>
        <option value="S_AL30">Last 30 Days (avg)</option>
        <!-- <option value="S_SDL30">Last 30 Days (std dev)</option> -->
        <option value="S_L14">Last 14 Days (total)</option>
        <option value="S_AL14">Last 14 Days (avg)</option>
        <!-- <option value="S_SDL14">Last 14 Days (std dev)</option> -->
        <option value="S_L7">Last 7 Days (total)</option>
        <option value="S_AL7">Last 7 Days (avg)</option>
        <!-- <option value="S_SDL7">Last 7 Days (std dev)</option> -->
      </optgroup>
      <optgroup label="Projected Stats">
        <option value="S_PSR">Remaining Games (proj)</option>
        <option value="S_PS7">Next 7 Days (proj)</option>
        <option value="S_PS14">Next 14 Days (proj)</option>
      </optgroup>
      <optgroup label="Splits, Ranks, &amp; Research">
        <option :value="'S_SPS_'+year()">Splits: Season</option>
        <option value="S_SPC">Splits: Career</option>
        <option value="K_K">Ranks</option>
        <option value="O_O">Opponents</option>
        <option value="R_R">Research</option>
        <option value="M_W">Fantasy Matchups</option>
        <option :value="'S_S_'+year(-1)">{{year(-1)}} - {{year(-2)}} Season (total)</option>
        <option :value="'S_AS_'+year(-1)">{{year(-1)}} - {{year(-2)}} Season (avg)</option>
        <option :value="'S_S_'+year(-2)">{{year(-2)}} - {{year(-3)}} Season (total)</option>
        <option :value="'S_AS_'+year(-2)">{{year(-2)}} - {{year(-3)}} Season (avg)</option>
      </optgroup>
      <!-- <optgroup label="Advanced Stats *NEW*">
        <option value="ADVST_ADVST_2019">Advanced Stats</option>
        <option value="ADVST_ADVST_2018">2018-19 Advanced Stats</option>
        <option value="ADVST_ADVST_2017">2017-18 Advanced Stats</option>
      </optgroup> -->
    </select>
    <button
      type="button"
      v-on:click="filterPlayers"
      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Filter
    </button>
  </div>
</template>
<script>
export default {
  name: 'FilterMenu',
  data () {
    return {
      proTeams: [
        {team_id: '25', team_name: 'Anaheim'},
        {team_id: '24', team_name: 'Arizona'},
        {team_id: '1', team_name: 'Boston'},
        {team_id: '2', team_name: 'Buffalo'},
        {team_id: '3', team_name: 'Calgary'},
        {team_id: '7', team_name: 'Carolina'},
        {team_id: '4', team_name: 'Chicago'},
        {team_id: '17', team_name: 'Colorado'},
        {team_id: '29', team_name: 'Columbus'},
        {team_id: '9', team_name: 'Dallas'},
        {team_id: '5', team_name: 'Detroit'},
        {team_id: '6', team_name: 'Edmonton'},
        {team_id: '26', team_name: 'Florida'},
        {team_id: '8', team_name: 'Los Angeles'},
        {team_id: '30', team_name: 'Minnesota'},
        {team_id: '10', team_name: 'Montreal'},
        {team_id: '12', team_name: 'NY Islanders'},
        {team_id: '13', team_name: 'NY Rangers'},
        {team_id: '27', team_name: 'Nashville'},
        {team_id: '11', team_name: 'New Jersey'},
        {team_id: '14', team_name: 'Ottawa'},
        {team_id: '15', team_name: 'Philadelphia'},
        {team_id: '16', team_name: 'Pittsburgh'},
        {team_id: '18', team_name: 'San Jose'},
        {team_id: '19', team_name: 'St. Louis'},
        {team_id: '20', team_name: 'Tampa Bay'},
        {team_id: '21', team_name: 'Toronto'},
        {team_id: '22', team_name: 'Vancouver'},
        {team_id: '58', team_name: 'Vegas'},
        {team_id: '23', team_name: 'Washington'},
        {team_id: '28', team_name: 'Winnipeg'}
      ],
      statusFilter: 'A',
      positionFilter: 'P',
      statsFilter: ''
    }
  },
  props: ['stats', 'searchParams', 'teams', 'positions'],
  computed: {
  },
  methods: {
    filterPlayers: function () {
      this.$emit(
        'filter',
        this.statusFilter,
        this.positionFilter,
        this.statsFilter
      )
    },
    year: function (offset) {
      return parseInt(new Date().toISOString().slice(0, 4)) + parseInt(offset)
    }
  }
}
</script>
