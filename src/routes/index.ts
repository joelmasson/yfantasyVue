import { RouteRecordRaw } from "vue-router";

import Dashboard from '../components/Dashboard.vue'
import League from '../components/League.vue'
import Game from '../components/Game.vue'
import Team from '../components/Team.vue'
import Players from '../components/Players.vue'
import PlayerPage from '../components/PlayerPage.vue'
import MatchupPage from '../components/MatchupPage.vue'

const DashboardRouter: Array<RouteRecordRaw> = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/game/:game_id', // This would be for the whole 2020 NHL season
        name: 'Game',
        component: Game
    },
    {
        path: '/game/:game_id/league/:league_id', // This would be for the 2020 DFHL Season
        name: 'League',
        component: League
    },
    {
        path: '/game/:game_id?/league/:league_id?/team/:team_id?/week/:week_num?',
        name: 'Team',
        component: Team
    },
    {
        path: '/game/:game_id/league/:league_id/players',
        name: 'Players',
        component: Players
    },
    {
        path: '/game/:game_id/player/:player_id',
        name: 'Player',
        component: PlayerPage
    },
    {
        path: '/game/:game_id/league/:league_id/week/:week_num/matchup/:matchup',
        name: 'Matchup',
        component: MatchupPage
    }
];
export default DashboardRouter;