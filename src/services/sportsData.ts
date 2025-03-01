import Axios from "axios";

type Player = {
  StatID: number;
  TeamID: number;
  PlayerID: number;
  SeasonType: number;
  Season: number;
  Name: string;
  Team: string;
  Position: string;
  FantasyDataSalary: number;
  FanDuelSalary: number;
  DraftKingsSalary: number;
  YahooSalary: number;
  InjuryStatus: string;
  InjuryBodyPart: string;
  InjuryStartDate: null;
  InjuryNotes: string;
  FanDuelPosition: string;
  DraftKingsPosition: string;
  YahooPosition: string;
  OpponentRank: number;
  OpponentPositionRank: number;
  GlobalTeamID: number;
  FantasyDraftSalary: null;
  FantasyDraftPosition: string;
  GameID: number;
  OpponentID: number;
  Opponent: string;
  Day: Date;
  DateTime: Date;
  HomeOrAway: string;
  IsGameOver: false;
  GlobalGameID: number;
  GlobalOpponentID: number;
  Updated: Date;
  Games: number;
  FantasyPoints: number;
  FantasyPointsFanDuel: number;
  FantasyPointsDraftKings: number;
  FantasyPointsYahoo: number;
  Minutes: number;
  Seconds: number;
  Goals: number;
  Assists: number;
  ShotsOnGoal: number;
  PowerPlayGoals: number;
  ShortHandedGoals: number;
  EmptyNetGoals: number;
  PowerPlayAssists: number;
  ShortHandedAssists: number;
  HatTricks: number;
  ShootoutGoals: number;
  PlusMinus: number;
  PenaltyMinutes: number;
  Blocks: number;
  Hits: number;
  Takeaways: number;
  Giveaways: number;
  FaceoffsWon: number;
  FaceoffsLost: number;
  Shifts: number;
  GoaltendingMinutes: number;
  GoaltendingSeconds: number;
  GoaltendingShotsAgainst: number;
  GoaltendingGoalsAgainst: number;
  GoaltendingSaves: number;
  GoaltendingWins: number;
  GoaltendingLosses: number;
  GoaltendingShutouts: number;
  Started: number;
  BenchPenaltyMinutes: number;
  GoaltendingOvertimeLosses: number;
  FantasyPointsFantasyDraft: number;
};

type GetPlayerResponse = {
  [x: string]: any;
  data: Player[];
};

export default async function getDailyProjection(date: string) {
  try {
    const { data, status } = await Axios.get<GetPlayerResponse>(
      "https://api.sportsdata.io/v3/nhl/projections/json/PlayerGameProjectionStatsByDate/" +
        date +
        "?key=5e5eab28999741c59dc36c6c3beed615"
    );
    interface Projection {
      name: string;
      team: string;
      position: string;
      minutes: number;
      goals: number;
      assists: number;
      shotsOnGoal: number;
      powerPlayGoals: number;
      powerPlayAssists: number;
      plusMinus: number;
      penaltyMinutes: number;
      blocks: number;
      hits: number;
      faceoffsWon: number;
      goaltendingMinutes: number;
      goaltendingShotsAgainst: number;
      goaltendingGoalsAgainst: number;
      goaltendingSaves: number;
      goaltendingWins: number;
      goaltendingShutouts: number;
      started: number;
    }

    const projections: Projection[] = data.map((player: Player): Projection => {
      return {
        name: player.Name,
        team: player.Team,
        position: player.Position,
        minutes: player.Minutes,
        goals: player.Goals,
        assists: player.Assists,
        shotsOnGoal: player.ShotsOnGoal,
        powerPlayGoals: player.PowerPlayGoals,
        powerPlayAssists: player.PowerPlayAssists,
        plusMinus: player.PlusMinus,
        penaltyMinutes: player.PenaltyMinutes,
        blocks: player.Blocks,
        hits: player.Hits,
        faceoffsWon: player.FaceoffsWon,
        goaltendingMinutes: player.GoaltendingMinutes,
        goaltendingShotsAgainst: player.GoaltendingShotsAgainst,
        goaltendingGoalsAgainst: player.GoaltendingGoalsAgainst,
        goaltendingSaves: player.GoaltendingSaves,
        goaltendingWins: player.GoaltendingWins,
        goaltendingShutouts: player.GoaltendingShutouts,
        started: player.Started,
      };
    });
    return {
      date: date,
      data: projections,
    };
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
    return error;
  }
}
