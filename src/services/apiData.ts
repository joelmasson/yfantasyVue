import Axios from "axios";

type Game = {
  HIT: number;
  ON_ICE_HIT: number;
  HIT_AGAINST: number;
  ON_ICE_HIT_AGAINST: number;
  "5_ON_4_HIT": number;
  "5_ON_4_ON_ICE_HIT": number;
  "5_ON_4_HIT_AGAINST": number;
  "5_ON_4_ON_ICE_HIT_AGAINST": number;
  "5_ON_3_HIT": number;
  "5_ON_3_ON_ICE_HIT": number;
  "5_ON_3_HIT_AGAINST": number;
  "5_ON_3_ON_ICE_HIT_AGAINST": number;
  "4_ON_5_HIT": number;
  "4_ON_5_ON_ICE_HIT": number;
  "4_ON_5_HIT_AGAINST": number;
  "4_ON_5_ON_ICE_HIT_AGAINST": number;
  "3_ON_5_HIT": number;
  "3_ON_5_ON_ICE_HIT": number;
  "3_ON_5_HIT_AGAINST": number;
  "3_ON_5_ON_ICE_HIT_AGAINST": number;
  BLOCKED_SHOT: number;
  ON_ICE_BLOCKED_SHOT: number;
  SHOT_BLOCKED: number;
  ON_ICE_SHOT_BLOCKED: number;
  "5_ON_4_BLOCKED_SHOT": number;
  "5_ON_4_ON_ICE_BLOCKED_SHOT": number;
  "5_ON_4_SHOT_BLOCKED": number;
  "5_ON_4_ON_ICE_SHOT_BLOCKED": number;
  "5_ON_3_BLOCKED_SHOT": number;
  "5_ON_3_ON_ICE_BLOCKED_SHOT": number;
  "5_ON_3_SHOT_BLOCKED": number;
  "5_ON_3_ON_ICE_SHOT_BLOCKED": number;
  "4_ON_5_BLOCKED_SHOT": number;
  "4_ON_5_ON_ICE_BLOCKED_SHOT": number;
  "4_ON_5_SHOT_BLOCKED": number;
  "4_ON_5_ON_ICE_SHOT_BLOCKED": number;
  "3_ON_5_BLOCKED_SHOT": number;
  "3_ON_5_ON_ICE_BLOCKED_SHOT": number;
  "3_ON_5_SHOT_BLOCKED": number;
  "3_ON_5_ON_ICE_SHOT_BLOCKED": number;
  SHOT: number;
  SHOT_MISSED: number;
  ON_ICE_SHOT_MISSED: number;
  ON_ICE_MISSED_SHOT: number;
  "5_ON_4_SHOT": number;
  "5_ON_4_SHOT_MISSED": number;
  "5_ON_4_ON_ICE_SHOT_MISSED": number;
  "5_ON_4_ON_ICE_MISSED_SHOT": number;
  "5_ON_3_SHOT": number;
  "5_ON_3_SHOT_MISSED": number;
  "5_ON_3_ON_ICE_SHOT_MISSED": number;
  "5_ON_3_ON_ICE_MISSED_SHOT": number;
  "4_ON_5_SHOT": number;
  "4_ON_5_SHOT_MISSED": number;
  "4_ON_5_ON_ICE_SHOT_MISSED": number;
  "4_ON_5_ON_ICE_MISSED_SHOT": number;
  "3_ON_5_SHOT": number;
  "3_ON_5_SHOT_MISSED": number;
  "3_ON_5_ON_ICE_SHOT_MISSED": number;
  "3_ON_5_ON_ICE_MISSED_SHOT": number;
  ON_ICE_SHOT: number;
  "5_ON_4_ON_ICE_SHOT": number;
  "5_ON_3_ON_ICE_SHOT": number;
  "4_ON_5_ON_ICE_SHOT": number;
  "3_ON_5_ON_ICE_SHOT": number;
  SAVE: number;
  "5_ON_4_SAVE": number;
  "5_ON_3_SAVE": number;
  "4_ON_5_SAVE": number;
  "3_ON_5_SAVE": number;
  ON_ICE_SAVE: number;
  "5_ON_4_ON_ICE_SAVE": number;
  "5_ON_3_ON_ICE_SAVE": number;
  "4_ON_5_ON_ICE_SAVE": number;
  "3_ON_5_ON_ICE_SAVE": number;
  FACEOFF_WIN: number;
  ON_ICE_FACEOFF_WIN: number;
  FACEOFF_LOSS: number;
  ON_ICE_FACEOFF_LOSS: number;
  "5_ON_4_FACEOFF_WIN": number;
  "5_ON_4_ON_ICE_FACEOFF_WIN": number;
  "5_ON_4_FACEOFF_LOSS": number;
  "5_ON_4_ON_ICE_FACEOFF_LOSS": number;
  "5_ON_3_FACEOFF_WIN": number;
  "5_ON_3_ON_ICE_FACEOFF_WIN": number;
  "5_ON_3_FACEOFF_LOSS": number;
  "5_ON_3_ON_ICE_FACEOFF_LOSS": number;
  "4_ON_5_FACEOFF_WIN": number;
  "4_ON_5_ON_ICE_FACEOFF_WIN": number;
  "4_ON_5_FACEOFF_LOSS": number;
  "4_ON_5_ON_ICE_FACEOFF_LOSS": number;
  "3_ON_5_FACEOFF_WIN": number;
  "3_ON_5_ON_ICE_FACEOFF_WIN": number;
  "3_ON_5_FACEOFF_LOSS": number;
  "3_ON_5_ON_ICE_FACEOFF_LOSS": number;
  PENALTY_AGAINST: number;
  ON_ICE_PENALTY_AGAINST: number;
  PENALTY_FOR: number;
  ON_ICE_PENALTY_FOR: number;
  "5_ON_4_PENALTY_AGAINST": number;
  "5_ON_4_ON_ICE_PENALTY_AGAINST": number;
  "5_ON_4_PENALTY_FOR": number;
  "5_ON_4_ON_ICE_PENALTY_FOR": number;
  "5_ON_3_PENALTY_AGAINST": number;
  "5_ON_3_ON_ICE_PENALTY_AGAINST": number;
  "5_ON_3_PENALTY_FOR": number;
  "5_ON_3_ON_ICE_PENALTY_FOR": number;
  GOAL: number;
  "5_ON_4_GOAL": number;
  "5_ON_3_GOAL": number;
  "4_ON_5_GOAL": number;
  "3_ON_5_GOAL": number;
  ASSIST: number;
  ASSIST_2: number;
  "5_ON_4_ASSIST": number;
  "5_ON_4_ASSIST_2": number;
  ON_ICE_GOAL: number;
  GOAL_ALLOWED: number;
  ON_ICE_GOAL_ALLOWED: number;
  "5_ON_4_ON_ICE_GOAL": number;
  "5_ON_4_GOAL_ALLOWED": number;
  "5_ON_4_ON_ICE_GOAL_ALLOWED": number;
  "5_ON_3_ON_ICE_GOAL": number;
  "5_ON_3_GOAL_ALLOWED": number;
  "5_ON_3_ON_ICE_GOAL_ALLOWED": number;
  "4_ON_5_ON_ICE_GOAL": number;
  "4_ON_5_GOAL_ALLOWED": number;
  "4_ON_5_ON_ICE_GOAL_ALLOWED": number;
  "3_ON_5_ON_ICE_GOAL": number;
  "3_ON_5_GOAL_ALLOWED": number;
  "3_ON_5_ON_ICE_GOAL_ALLOWED": number;
  TAKEAWAY: number;
  ON_ICE_TAKEAWAY: number;
  "5_ON_4_TAKEAWAY": number;
  "5_ON_4_ON_ICE_TAKEAWAY": number;
  "5_ON_3_TAKEAWAY": number;
  "5_ON_3_ON_ICE_TAKEAWAY": number;
  "4_ON_5_TAKEAWAY": number;
  "4_ON_5_ON_ICE_TAKEAWAY": number;
  "3_ON_5_TAKEAWAY": number;
  "3_ON_5_ON_ICE_TAKEAWAY": number;
  GIVEAWAY: number;
  ON_ICE_GIVEAWAY: number;
  "5_ON_4_GIVEAWAY": number;
  "5_ON_4_ON_ICE_GIVEAWAY": number;
  "5_ON_3_GIVEAWAY": number;
  "5_ON_3_ON_ICE_GIVEAWAY": number;
  "4_ON_5_GIVEAWAY": number;
  "4_ON_5_ON_ICE_GIVEAWAY": number;
  "3_ON_5_GIVEAWAY": number;
  "3_ON_5_ON_ICE_GIVEAWAY": number;
  ON_ICE_OFFSIDE: number;
  ON_ICE_ICING: number;
  ON_ICE_PUCK_OUT_OF_PLAY: number;
  "5_ON_4_ON_ICE_OFFSIDE": number;
  "5_ON_4_ON_ICE_ICING": number;
  "5_ON_4_ON_ICE_PUCK_OUT_OF_PLAY": number;
  "5_ON_3_ON_ICE_OFFSIDE": number;
  "5_ON_3_ON_ICE_ICING": number;
  "5_ON_3_ON_ICE_PUCK_OUT_OF_PLAY": number;
  "4_ON_5_ON_ICE_OFFSIDE": number;
  "4_ON_5_ON_ICE_ICING": number;
  "4_ON_5_ON_ICE_PUCK_OUT_OF_PLAY": number;
  "3_ON_5_ON_ICE_OFFSIDE": number;
  "3_ON_5_ON_ICE_ICING": number;
  "3_ON_5_ON_ICE_PUCK_OUT_OF_PLAY": number;
  SHOOTOUT_GOAL: number;
  SHOOTOUT_GOAL_ALLOWED: number;
  SHOOTOUT_SHOT: number;
  SHOOTOUT_SAVE: number;
  SHOOTOUT_MISS: number;
  SHOOTOUT_ON_ICE_MISS: number;
  CORSI_FOR: number;
  CORSI_AGAINST: number;
  PLUS_MINUS: number;
  GAME_SCORE: number;
  TOI: number;
};

type PlayerGameAverages = {
  data: Game[];
};

type names = [string];

interface unknownQuery {
  [key: string]: any;
}
/**
 *
 * @param matchData Values that match player attributes eg. {name:[list,of,names]}
 * @param numberOfGames Number of games that are averaged
 * @param sortBy Which value the players should be sorted by
 * @param start Start game number for the previous games
 * @param end Last game number for the previous games
 * @param stats Return the players's previous stats
 * @returns
 */
export async function getPlayerAverages(
  matchData: unknownQuery,
  numberOfGames: number,
  sortBy: string,
  start: number,
  end: number,
  stats: boolean
) {
  let queryObj: unknownQuery = {};
  for (var key in matchData) {
    if (!queryObj.hasOwnProperty(key)) {
      queryObj[key] = { $in: matchData[key] };
    }
  }
  let season = start.toString().slice(0, 4) + "020000";
  // console.log(
  //   JSON.stringify({
  //     data: queryObj,
  //     statType: "averages",
  //     sortBy: sortBy,
  //     limit: numberOfGames,
  //     season: parseInt(season),
  //     start: start,
  //     end: end,
  //     stats: stats,
  //   })
  // );
  try {
    const { data, status } = await Axios.post<PlayerGameAverages>(
      "/api/players",
      {
        data: queryObj,
        statType: "averages",
        sortBy: sortBy,
        limit: numberOfGames,
        season: parseInt(season),
        start: start,
        end: end,
        stats: stats,
      }
    );
    return data;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}
/**
 *
 * @param dates Values that match player attributes eg. {name:[list,of,names]}
 * @param game_id Number of games that are averaged
 * @param league_id Which value the players should be sorted by
 * @param team_id Start game number for the previous games
 * @returns
 */
export async function getWeekRoster(
  dates: [string],
  game_id: string,
  league_id: string,
  team_id: string
) {
  /* -----
        Get all roster players and the days where they are starting from Yahoo
      ---- */
  let startingLineupPromise = dates.map((date) => {
    let day = new Date(date);
    day = day.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return Axios.post("/api/yahoo/roster/players", {
      team_key: game_id + ".l." + league_id + ".t." + team_id,
      date: day,
    }).then((response) => {
      return response.data.roster;
    });
  });
  try {
    const data = Promise.allSettled(startingLineupPromise).then(
      (response: unknownQuery) => {
        console.log(response);
        let roster = new Set();
        response.forEach((day) => {
          day.value.forEach((player) => {
            if (roster.size === 0) {
              roster.add({
                ...player,
                averages: [],
                previousGames: [],
                selected: true,
                starting: [],
                stats: [],
              });
            } else {
              let RP = [...roster].find((rosteredPlayer) => {
                if (rosteredPlayer.player_key === player.player_key) {
                  return rosteredPlayer;
                }
              });
              if (RP === undefined) {
                roster.add({
                  ...player,
                  averages: [],
                  previousGames: [],
                  selected: true,
                  starting: [],
                });
              }
            }
          });
        });
        response.forEach((day, i) => {
          roster.forEach((player) => {
            let dayPlayer = day.value.filter(
              (gamePlayer: { player_id: any }) => {
                if (gamePlayer.player_id === player.player_id) {
                  return gamePlayer;
                }
              }
            );
            if (dayPlayer.length > 0) {
              player.starting.push({
                date: dates[i],
                position: dayPlayer[0].selected_position,
                gamePk: "",
                status: null,
                sos: 0,
              });
            }
          });
        });
        return roster;
      }
    );
    return data;
  } catch (error) {
    console.log("unexpected error: ", error);
    return "An unexpected error occurred";
  }
}
