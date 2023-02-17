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

export function gameDays(start: string, end: string) {
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
    var mm = date.getMonth();
    var dd = date.getDate().toString();

    var ddChars = dd.split("");

    return yyyy + "-" + months[mm] + "-" + (ddChars[1] ? dd : "0" + ddChars[0]);
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

export function statline(categories: StatCategories, stats: Stats) {
  return categories.map((cat) => {
    let projectedStat = Object.keys(stats)
      .filter((stat) => {
        if (statIdToProjection(cat.stat_id.toString()) === stat) {
          return stats[stat];
        }
      })
      .map((stat) => {
        return stats[stat];
      })[0];
    return {
      display_name: cat.display_name,
      value: projectedStat === undefined ? 0 : projectedStat,
    };
  });
}
