import FilterMenu from 'FilterMenu'
import Profile from 'Profile'
<template>
    <div>
        <FilterMenu></FilterMenu>
        <table>
            <tbody>
                <tr v-for="transaction in transactions" :key="transaction.id">
                    <td>{{transaction.type}}</td>
                    <td>
                        <Profile v-for="player in players" :key="player"></Profile>
                        <hr />
                        <Profile v-for="player in players" :key="player"></Profile>
                    </td>
                    <td>
                        <Profile></Profile>
                        <div v-if="transaction.type === 'trade'">
                            <hr/>
                            <Profile></Profile>
                        </div>
                    </td>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
  name: 'Transactions',
  data () {
    return {
      transactions: []
    }
  },
  methods: {
    getTransactions: function () {

    }
  }
}
</script>
