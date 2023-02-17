type Game = {
  gameDate: Date;
  gamePK: number;
  gameType: string;
  season: string;
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
  team: {
    id: number;
  };
  pointsPercentage: number;
};

export default function gameSOS(
  opponent: number,
  games: [Game],
  standings: [Standing]
) {
  // Get Opponent's Schedule
  let opponentSchedule = games.filter((game) => {
    if (game?.teams?.home?.team.id === opponent) {
      return game;
    } else if (game?.teams?.away?.team.id === opponent) {
      return game;
    }
  });
  // Get Opponent's Opponents Record
  let allOpponents = opponentSchedule.map((game) => {
    if (game?.teams?.home?.team.id === opponent) {
      return game?.teams?.away?.team.id;
    } else if (game?.teams?.away?.team.id === opponent) {
      return game?.teams?.home?.team.id;
    }
  });
  let OOR: number = standings
    .filter((team) => {
      if (allOpponents.includes(team.team.id)) {
        return team;
      }
    })
    .map((team) => {
      return team.pointsPercentage;
    })
    .reduce((accumulator: number, currentValue: number) => {
      return (accumulator + currentValue) / 2;
    }, 0);

  let opponentRecord: number = standings
    .filter((team) => {
      if (opponent === team.team.id) {
        return team;
      }
    })
    .map((team) => {
      return team.pointsPercentage;
    })[0];
  return (2 * opponentRecord + OOR / allOpponents.length) / 3;
}
