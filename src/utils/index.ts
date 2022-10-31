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
