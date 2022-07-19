<template>
    <div>
        <div>
            <div v-for="player in homePlayers" :key="player.id">
                <Card></Card>
            </div>
            <div v-for="player in awayPlayers" :key="player.id">
                <Card></Card>
            </div>
        </div>
        <div>
            <table>
                <tbody>
                    <tr v-for="stat in stats" :key="stat.id">
                        <td>{{stat.home}}</td>
                        <td>{{stat.category}}</td>
                        <td>{{stat.away}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
  name: 'Trade',
  data () {
    return {

    }
  }
}
</script>
