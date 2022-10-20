export function statIdToProjection(category: string) {
    switch (category) {
        case '1':
            return 'Goals'
            break
        case '2':
            return 'Assists'
            break
        case '4':
            return 'PlusMinus'
            break
        case '5':
            return 'PenaltyMinutes'
            break
        case '8':
            return 'PowerPlayPoints'
            break
        case '12':
            return 'GameWinningGoals'
            break
        case '16':
            return 'FaceoffsWon'
            break
        case '31':
            return 'Hits'
            break
        case '32':
            return 'Blocks'
            break
        case '19':
            return 'GoaltendingWins'
            break
        case '22':
            return 'GoaltendingGoalsAgainst'
            break
        case '23':
            return 'GoaltendingGoalsAgainstAverage'
            break
        case '25':
            return 'GoaltendingSaves'
            break
        case '24':
            return 'GoaltendingShotsAgainst'
            break
        case '26':
            return 'GoaltendingSavePercentage'
            break
        case '27':
            return 'GoaltendingShutouts'
            break
        default:
            break
    }
}