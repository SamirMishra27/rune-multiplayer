import { Players } from 'rune-games-sdk/multiplayer'
import { PlayerState } from '../logic/types'

function LeaderboardEntry(props: { participants: Players; player: PlayerState; index: number }) {
    const { participants, player, index } = props
    const playerInfo = participants[player.id]

    function getBorderColour(index: number): string {
        if (index === 0) return '#FFD93D'
        else if (index === 1) return '#9DB2BF'
        else return '#6C3428'
    }

    return (
        <div
            className=" w-full px-2 py-1 flex items-center justify-between bg-orange-300 rounded-xl border-x-8 border-y-2"
            style={{
                borderColor: getBorderColour(index),
            }}>
            <img src={playerInfo.avatarUrl} className=" w-6 h-auto rounded-full" />
            <span className=" text-lg -ml-10 text-left">{playerInfo.displayName} </span>
            <span className=" text-lg text-right">{player.runs} Runs</span>
        </div>
    )
}

export default function Leaderboards(props: {
    participants: Players | undefined
    playerStats: PlayerState[]
}) {
    const { participants, playerStats } = props

    return (
        <aside className=" w-11/12 flex flex-col items-center justify-evenly py-2 gap-1 [border:1px_solid_black] rounded-lg">
            <h1 className=" text-2xl font-medium text-white">Leaderboard</h1>
            {participants &&
                playerStats.map((player, index) => (
                    <LeaderboardEntry
                        participants={participants}
                        player={player}
                        index={index}
                        key={player.id}
                    />
                ))}
        </aside>
    )
}
