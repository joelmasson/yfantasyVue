import { GameEvents, StatCategories, Stats } from "../types";

export function statIdToProjection(category: string) {
  switch (category) {
    case "1":
      return "Goals";
    case "2":
      return "Assists";
    case "4":
      return "PlusMinus";
    case "5":
      return "PenaltyMinutes";
    case "8":
      return "PowerPlayPoints";
    case "12":
      return "GameWinningGoals";
    case "16":
      return "FaceoffsWon";
    case "31":
      return "Hits";
    case "32":
      return "Blocks";
    case "19":
      return "GoaltendingWins";
    case "22":
      return "GoaltendingGoalsAgainst";
    case "23":
      return "GoaltendingGoalsAgainstAverage";
    case "25":
      return "GoaltendingSaves";
    case "24":
      return "GoaltendingShotsAgainst";
    case "26":
      return "GoaltendingSavePercentage";
    case "27":
      return "GoaltendingShutouts";
    default:
  }
}

export function YahooCategoryToAPIStat(name: string, averages: GameEvents) {
  if (averages === undefined) {
    return 0;
  }
  switch (name) {
    case "Goals":
      return averages.GOAL;
    case "Assists":
      return averages.ASSIST + averages.ASSIST_2;
    case "Plus/Minus":
      return averages.PLUS_MINUS;
    case "PlusMinus":
      return averages.PLUS_MINUS;
    case "Penalty Minutes":
      return averages.PENALTY_MINUTES;
    case "PenaltyMinutes":
      return averages.PENALTY_MINUTES;
    case "PowerPlayPoints":
      return (
        averages["5_ON_4_GOAL"] +
        averages["5_ON_3_GOAL"] +
        averages["5_ON_4_ASSIST"] +
        averages["5_ON_4_ASSIST_2"]
      );
    case "Powerplay Points":
      return (
        averages["5_ON_4_GOAL"] +
        averages["5_ON_3_GOAL"] +
        averages["5_ON_4_ASSIST"] +
        averages["5_ON_4_ASSIST_2"]
      );
    case "FaceoffsWon":
      return averages["FACEOFF_WIN"];
    case "Faceoffs Won":
      return averages["FACEOFF_WIN"];
    case "Hits":
      return averages["HIT"];
    case "Blocks":
      return averages["BLOCKED_SHOT"];
    case "Goals Against":
      return averages["GOAL_ALLOWED"];
    case "GoaltendingGoalsAgainst":
      return averages["GOAL_ALLOWED"];
    case "Goals Against Average":
      return averages["GOALS_AGAINST_AVERAGE"];
    case "GoaltendingGoalsAgainstAverage":
      return averages["GOALS_AGAINST_AVERAGE"];
    case "Saves":
      return averages["SAVE"];
    case "GoaltendingSaves":
      return averages["SAVE"];
    case "Shots Against":
      return averages["SAVE"] + averages["GOAL_ALLOWED"];
    case "GoaltendingShotsAgainst":
      return averages["SAVE"] + averages["GOAL_ALLOWED"];
    case "Save Percentage":
      return averages["SAVE_PERCENTAGE"];
    case "GoaltendingSavePercentage":
      return averages["SAVE_PERCENTAGE"];
    case "Shutouts":
      return averages["SHUTOUT"];
    case "GoaltendingShutouts":
      return averages["SHUTOUT"];
    default:
      return 0;
  }
}
export function AverageStatByOpposition(
  averages: GameEvents,
  oppositionRating: number,
  statCategories: StatCategories
) {
  statCategories.map((category) => {
    let value =
      YahooCategoryToAPIStat(category.name, averages) * oppositionRating;
    return {
      name: category.display_name,
      value: value,
    };
  });
}

export function gameDays(start: string, end: string, abbrv: boolean) {
  function convertDate(date: Date) {
    var months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString().padStart(2, "0");
    var dd = date.getDate().toString();

    var ddChars = dd.split("");
    if (abbrv) {
      return (
        yyyy +
        "-" +
        months[parseInt(mm) - 1] +
        "-" +
        (ddChars[1] ? dd : "0" + ddChars[0])
      );
    } else {
      return yyyy + "-" + mm + "-" + (ddChars[1] ? dd : "0" + ddChars[0]);
    }
  }
  function getDates(start: Date, end: Date) {
    let arr = [];
    end = new Date(end.setDate(end.getDate() + 2));
    for (
      start;
      start < end;
      start = new Date(start.setDate(start.getDate() + 1))
    ) {
      arr.push(convertDate(new Date(start)));
    }
    return arr;
  }
  return getDates(new Date(start + "T23:59:59.000-04:00"), new Date(end));
}

export function StatLine(categories: StatCategories, stats: Stats) {
  return categories.map((category) => {
    return stats.find((stat) => {
      if (category.stat_id === parseInt(stat.stat_id.toString())) {
        return stat;
      }
    });
  });
}

export function PlayersProjection(players: Array<any>, categories: Array<any>) {
  return categories.map((stat) => {
    let value = [...players]
      .map((player) => {
        let playerStats = player.starting
          .filter((day: { game_id: string }) => day.game_id !== "")
          .map((match: { status: string; gamePk: any; sos: number }) => {
            // Loop over each day in the week
            if (match.status === "Final") {
              let gameStats = player?.previousGames?.filter(
                (previousGame: { gamePk: any }) =>
                  previousGame.gamePk === match.gamePk
              )[0];
              if (gameStats !== undefined) {
                let statValue = YahooCategoryToAPIStat(stat.name, gameStats);
                if (
                  isNaN(statValue) ||
                  statValue === undefined ||
                  statValue === null
                ) {
                  statValue = 0;
                }
                return statValue;
              }
              return 0;
            } else {
              let statValue = YahooCategoryToAPIStat(
                stat.name,
                player.averages
              );
              if (
                isNaN(statValue) ||
                statValue === undefined ||
                statValue === null
              ) {
                statValue = 0;
              }
              return statValue * (1 - match.sos);
            }
          });
        let ps = playerStats.reduce((a: any, b: any) => {
          return a + b;
        }, 0);
        return ps;
      })
      .reduce((a, b) => a + b, 0)
      .toFixed(2);
    return { name: stat.name, value: value };
  });
}

export function TeamAbbvYahooToNHL(abbv: string) {
  switch (abbv) {
    case "ANA":
      return 24;
    case "ARI":
      return 53;
    case "BOS":
      return 6;
    case "BUF":
      return 7;
    case "CAR":
      return 12;
    case "CBJ":
      return 29;
    case "CGY":
      return 20;
    case "CHI":
      return 16;
    case "COL":
      return 21;
    case "DAL":
      return 25;
    case "DET":
      return 17;
    case "EDM":
      return 22;
    case "FLA":
      return 13;
    case "LAK":
      return 26;
    case "MIN":
      return 30;
    case "MTL":
      return 8;
    case "NJD":
      return 1;
    case "NSH":
      return 18;
    case "NYI":
      return 2;
    case "NYR":
      return 3;
    case "OTT":
      return 9;
    case "PHI":
      return 4;
    case "PIT":
      return 5;
    case "SEA":
      return 55;
    case "SJS":
      return 28;
    case "STL":
      return 19;
    case "TBL":
      return 14;
    case "TOR":
      return 10;
    case "VAN":
      return 23;
    case "VGK":
      return 54;
    case "WPG":
      return 52;
    case "WSH":
      return 15;
  }
}

export function TeamNHLIdtoAbbv(id: number) {
  switch (id) {
    case 24:
      return "ANA";
    case 53:
      return "ARI";
    case 6:
      return "BOS";
    case 7:
      return "BUF";
    case 12:
      return "CAR";
    case 29:
      return "CBJ";
    case 20:
      return "CGY";
    case 16:
      return "CHI";
    case 21:
      return "COL";
    case 25:
      return "DAL";
    case 17:
      return "DET";
    case 22:
      return "EDM";
    case 13:
      return "FLA";
    case 26:
      return "LAK";
    case 30:
      return "MIN";
    case 8:
      return "MTL";
    case 1:
      return "NJD";
    case 18:
      return "NSH";
    case 2:
      return "NYI";
    case 3:
      return "NYR";
    case 9:
      return "OTT";
    case 4:
      return "PHI";
    case 5:
      return "PIT";
    case 55:
      return "SEA";
    case 28:
      return "SJS";
    case 19:
      return "STL";
    case 14:
      return "TBL";
    case 10:
      return "TOR";
    case 23:
      return "VAN";
    case 54:
      return "VGK";
    case 52:
      return "WPG";
    case 15:
      return "WSH";
  }
}
