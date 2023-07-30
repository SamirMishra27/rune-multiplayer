import type { RuneClient } from 'rune-games-sdk/multiplayer'
import { RunRaceGame, GameActions, PlayerState, PlayerId, FinalScores } from './types.ts'

declare global {
    const Rune: RuneClient<RunRaceGame, GameActions>
}

function newRunRaceGame(): RunRaceGame {
    return {
        maxOvers: 5,
        maxWickets: 5,
        gameOver: false,
        playerStats: {},
    }
}

function newRunRacePlayer(playerId: PlayerId): PlayerState {
    return {
        id: playerId,
        runs: 0,
        balls: 0,
        wickets: 0,
        isOut: false,
        timeline: [],
    }
}

Rune.initLogic({
    minPlayers: 2,
    maxPlayers: 4,

    setup: (allPlayerIds: string[]): RunRaceGame => {
        const game = newRunRaceGame()

        allPlayerIds.forEach((playerId) => {
            // eslint-disable-next-line rune/no-parent-scope-mutation
            game.playerStats[playerId] = newRunRacePlayer(playerId)
        })

        return game
    },
    actions: {
        incrementRuns: ({ action, playerId }, { game }) => {
            game.playerStats[playerId].timeline.push(action)

            if (typeof action === 'number') {
                game.playerStats[playerId].runs += action
                game.playerStats[playerId].balls += 1
            }

            // End game check
            const allPlayerIds = Object.keys(game.playerStats)
            const allPlayersOut = !allPlayerIds.filter(
                (playerId) => game.playerStats[playerId].balls < game.maxOvers * 6
            ).length

            if (allPlayersOut) {
                const finalScores: FinalScores = {}
                for (playerId of allPlayerIds) {
                    finalScores[playerId] = game.playerStats[playerId].runs
                }

                Rune.gameOver({
                    players: finalScores,
                })
            }
        },
        incrementWicket: ({ action, playerId }, { game }) => {
            game.playerStats[playerId].timeline.push(action)

            if (action === 'W') {
                game.playerStats[playerId].wickets += 1
                game.playerStats[playerId].balls += 1
            }

            if (game.playerStats[playerId].wickets === 5) {
                game.playerStats[playerId].isOut = true
            }

            // End game check
            const allPlayerIds = Object.keys(game.playerStats)
            const allPlayersOut = !allPlayerIds.filter(
                (playerId) => game.playerStats[playerId].isOut === false
            ).length

            if (allPlayersOut) {
                const finalScores: FinalScores = {}
                for (playerId of allPlayerIds) {
                    finalScores[playerId] = game.playerStats[playerId].runs
                }

                Rune.gameOver({
                    players: finalScores,
                })
            }
        },
    },
    events: {
        playerJoined: (playerId, { game }) => {
            // Handle player joined

            game.playerStats[playerId] = newRunRacePlayer(playerId)
        },
        playerLeft(playerId, { game }) {
            // Handle player left

            delete game.playerStats[playerId]
        },
    },
})
