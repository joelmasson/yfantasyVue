import { Averages, StatCategories } from "../types";

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

function StatAveragesMerged(name: string, averages: Averages) {
  switch (name) {
    case "Goals":
      return averages.GOAL;
    case "Assists":
      return averages.ASSIST + averages.ASSIST_2;
    case "PlusMinus":
      return averages.PLUS_MINUS;
    case "PowerPlayPoints":
      return averages.PLUS_MINUS;
    case "PenaltyMinutes":
      return averages.PENALTY_FOR;
    case "PowerPlayPoints":
      return (
        averages["5_ON_4_GOAL"] +
        averages["5_ON_3_GOAL"] +
        averages["5_ON_4_ASSIST"] +
        averages["5_ON_4_ASSIST_2"]
      );
    case "FaceoffsWon":
      return averages["FACEOFF_WIN"];
    case "Hits":
      return averages["HIT"];
    case "Blocks":
      return averages["BLOCKED_SHOT"];
    default:
      break;
  }
}

export function AverageStatByOpposition(
  averages: Averages,
  oppositionRating: string,
  statCategories: StatCategories
) {
  statCategories.map((category) => {
    let value = StatAveragesMerged(category.name, averages)
    return {
      'name':category.display_name,
      'value':value
    }
  });
}
