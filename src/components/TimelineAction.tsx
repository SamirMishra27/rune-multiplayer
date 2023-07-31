import { RunRaceAction } from '../logic/types'

export default function TimelineAction(props: { action: RunRaceAction }) {
    const { action } = props

    return (
        <div
            className="timeline-action px-2 rounded-lg font-medium text-slate-50 text-xl"
            data-action={action.toString()}>
            {action}
        </div>
    )
}
