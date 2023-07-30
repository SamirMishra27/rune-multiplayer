import { useEffect, useState, MouseEvent } from 'react'
import { RunRaceGame, PlayerState, PlayerAction } from './logic/types.ts'
import { getRandInt } from './utils.ts'
import './index.css'
import ActionButton from './components/ActionButton.tsx'
import { Players } from 'rune-games-sdk/multiplayer'
import { sleep } from './utils.ts'

function App() {
    const [game, setGame] = useState<RunRaceGame>()
    const [stats, setStats] = useState<PlayerState>()
    const [playerId, setPlayerId] = useState<string>('')
    const [preventPlay, setPreventPlay] = useState<boolean>(false)

    const [participants, setParticipants] = useState<Players>()
    const [playerStats, setPlayerStats] = useState<PlayerState[]>([])

    const [compAction, setAction] = useState<number | null>(null)
    const [rank, setRank] = useState<number>(4)

    const [wait, setWait] = useState<boolean>(false)
    const [commentary, setCommentary] = useState('Good luck! 😎')

    const overs = (balls: number): string => `${Math.floor(balls / 6)}.${balls % 6}`

    function getCurrentRank() {
        for (let i = 0; i < playerStats.length; i++) {
            if (playerStats[i].id === playerId) {
                setRank(i + 1)

                break
            }
        }
    }

    function getBorderColour(index: number): string {
        if (index === 0) return '#FFD93D'
        else if (index === 1) return '#9DB2BF'
        else return '#6C3428'
    }

    useEffect(() => {
        Rune.initClient({
            onChange: ({ newGame, yourPlayerId, players, event }) => {
                if (yourPlayerId) {
                    setPlayerId(yourPlayerId)
                    setStats(newGame.playerStats[yourPlayerId])
                }

                if (event?.event === 'playerLeft' && participants) {
                    const leftPlayerId = event.params.playerId

                    setCommentary(`Player ${leftPlayerId} has left the game!`)
                }

                const playerStats = Object.values(newGame.playerStats)
                playerStats.sort(
                    (a, b) => b.runs - a.runs || a.wickets - b.wickets || a.balls || b.balls
                )
                setPlayerStats(playerStats)

                setGame(newGame)
                setParticipants(players)
                getCurrentRank()

                if (event?.event === 'playerJoined') {
                    const newPlayerId = event.params.playerId
                    const newPlayerInfo = players[newPlayerId]

                    setCommentary(`${newPlayerInfo.displayName} has joined the game!`)
                }
            },
        })
    }, [])

    useEffect(() => {
        getCurrentRank()
    }, [playerStats])

    useEffect(() => {
        if (!stats || !game) return

        setPreventPlay(stats.balls >= game.maxOvers * 6 || stats.wickets >= game.maxWickets)
    }, [stats])

    async function handleAction(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        if (!(event.target instanceof HTMLButtonElement)) return

        setCommentary('Computer is thinking 💭')
        setWait(true)
        await sleep(1 * 1000)

        const action: PlayerAction = Number(event.target.dataset.action) as PlayerAction
        let computerAction: number = getRandInt(0, 6)

        if (
            stats &&
            stats.timeline.at(-2) === stats.timeline.at(-1) &&
            stats.timeline.at(-1) === action
        ) {
            computerAction = action
        }

        setAction(computerAction)

        if (action === computerAction) {
            const action = 'W'
            Rune.actions.incrementWicket({ action, playerId })

            if (stats && stats.wickets + 1 === game!.maxWickets) {
                setCommentary('You are all out! Waiting for the game to end...')
            } else {
                setCommentary('You are out! Haha')
            }
        } else {
            Rune.actions.incrementRuns({ action, playerId })

            if (stats && stats.balls + 1 === game!.maxOvers * 6) {
                setCommentary('Overs finished! Waiting for the game to end...')
            } else {
                setCommentary('Nice shot!')
            }
        }
        setWait(false)
    }

    if (!game) {
        return <div>Loading...</div>
    }

    return (
        <main className=" w-full h-full flex flex-col items-center justify-evenly gap-2 overflow-hidden">
            <aside className=" w-11/12 flex flex-col items-center justify-evenly p-2 gap-1 [border:1px_solid_black] rounded-lg">
                <h1 className=" text-2xl font-medium text-white">Leaderboard</h1>
                {participants &&
                    playerStats.map((player, index) => {
                        const playerInfo = participants[player.id]

                        return (
                            <div
                                className=" w-full px-3 py-1 flex items-center justify-between bg-orange-300 rounded-xl border-x-8 border-y-2"
                                key={player.id}
                                style={{
                                    borderColor: getBorderColour(index),
                                }}>
                                <span className=" text-lg">{playerInfo.displayName} </span>
                                <span className=" text-lg">{player.runs} Runs</span>
                            </div>
                        )
                    })}
            </aside>

            <section className=" flex items-center justify-evenly px-1 gap-2 text-white">
                <aside className=" min-w-[4rem] min-h-[5.25rem] flex flex-col items-center text-center justify-evenly px-4 py-1 [border:1px_solid_white] rounded-xl">
                    <h3 className=" px-1 text-lg font-medium">Score</h3>
                    <hr className=" w-11/12 border-slate-900" />
                    {stats ? (
                        <p>
                            {stats.runs} / {stats.wickets} ({overs(stats.balls)})
                        </p>
                    ) : (
                        <p>0 / 0 (0.0)</p>
                    )}
                </aside>

                <aside className=" min-w-[4rem] min-h-[5.25rem] flex items-center text-center justify-evenly px-1 py-1 [border:1px_solid_white] rounded-xl">
                    <h3 className=" px-1 text-base font-medium">Computer Action</h3>
                    <p className=" text-2xl px-2">{compAction ?? '?'}</p>
                </aside>

                <aside className=" min-w-[4rem] min-h-[5.25rem] flex flex-col items-center text-center justify-evenly px-1 py-1 [border:1px_solid_white] rounded-xl">
                    <h3 className=" px-1 text-lg font-medium">Rank</h3>
                    <hr className=" w-11/12 border-slate-900" />
                    <p className=" text-xl">#{rank}!</p>
                </aside>
            </section>

            <section className="commentary w-11/12 max-h-14 bg-gray-50 rounded-xl px-2 py-1 text-center relative">
                <span className=" absolute left-2">🎙️</span>
                <span className=" px-4">{commentary}</span>
            </section>

            <section className="actions bg-[#bca180] flex flex-wrap items-center justify-evenly px-3 py-2 gap-2 rounded-2xl mx-6">
                {[0, 1, 2, 3, 4, 5, 6].map((action) => (
                    <ActionButton
                        action={action}
                        handleAction={handleAction}
                        disabled={preventPlay}
                        key={action}
                        wait={wait}
                    />
                ))}
            </section>

            <section className=" w-10/12 h-9 flex items-center justify-evenly p-2 bg-[#bca180] gap-1 mx-4 rounded-2xl ">
                {stats &&
                    stats.timeline.slice(-6).map((action, index) => (
                        <div
                            className="timeline-action px-2 rounded-lg font-medium text-slate-50 text-xl"
                            data-action={action.toString()}
                            key={`ta-${index}-${action}`}>
                            {action}
                        </div>
                    ))}
            </section>
        </main>
    )
}

export default App
