export type PlayerId = string

export type RunRaceAction = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 'W'

export type PlayerAction = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type GameActions = {
    incrementRuns: (params: { action: RunRaceAction; playerId: string }) => void

    incrementWicket: (params: { action: RunRaceAction; playerId: string }) => void
}

export interface PlayerState {
    id: PlayerId
    runs: number
    balls: number
    wickets: number
    isOut: boolean
    timeline: RunRaceAction[]
}

export interface PlayerStatsState {
    [key: PlayerId]: PlayerState
}

export interface RunRaceGame {
    maxOvers: number
    maxWickets: number
    gameOver: boolean
    playerStats: PlayerStatsState
}

export interface FinalScores {
    [key: PlayerId]: number
}
