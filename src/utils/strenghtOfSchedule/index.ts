type Game = {
  [x: string]: any;
  gameDate: Date;
  gamePK: number;
  gameType: string;
  season: string;
  gameState: "OFF" | "FUT";
  status: {
    abstractGameState: string;
    codedGameState: string;
    detailedState: string;
    statusCode: string;
    startTimeTBD: false;
  };
  teams: {
    home?: Team;
    away?: Team;
  };
};

type Team = {
  leagueRecord: {
    wins: number;
    losses: number;
    ot: number;
    type: string;
  };
  score: number;
  team: {
    id: number;
    name: string;
    link: string;
  };
};

type Standing = {
  [x: string]: any;
  teamAbbrev: any;
  team: {
    id: number;
  };
  pointPctg: number;
};

export default function gameSOS(
  opponent: String,
  games: [Game],
  standings: [Standing]
) {
  // Get Opponent's Schedule
  let opponentSchedule = games.filter((game) => {
    if (game.homeTeam.abbrev === opponent) {
      return game;
    } else if (game?.awayTeam.abbrev === opponent) {
      return game;
    }
  });
  // Get Opponent's Opponents Record
  let allOpponentsAbbrev = opponentSchedule.map((game) => {
    if (game.homeTeam.abbrev === opponent) {
      return game?.awayTeam.abbrev;
    } else if (game?.awayTeam.abbrev === opponent) {
      return game.homeTeam.abbrev;
    }
  });
  let OOR: number = standings
    .filter((team) => {
      if (allOpponentsAbbrev.includes(team.teamAbbrev.default)) {
        return team;
      }
    })
    .map((team) => {
      return team.pointPctg;
    })
    .reduce((accumulator: number, currentValue: number) => {
      return (accumulator + currentValue) / 2;
    }, 0);

  let opponentRecord: number = standings
    .filter((team) => {
      if (opponent === team.teamAbbrev.default) {
        return team;
      }
    })
    .map((team) => {
      return team.pointPctg;
    })[0];
  return (2 * opponentRecord + OOR / allOpponentsAbbrev.length) / 3;
}
