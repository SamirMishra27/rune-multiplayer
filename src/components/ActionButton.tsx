import { MouseEvent } from 'react'

export default function ActionButton(props: {
    action: number
    handleAction: (event: MouseEvent<HTMLButtonElement>) => void
    disabled: boolean
    wait: boolean
}) {
    const { action, handleAction, disabled, wait } = props

    return (
        <button
            className={
                ' px-4 py-1 rounded-lg font-medium text-lg transition-colors duration-300' +
                ' text-white disabled:text-slate-300' +
                ' bg-gradient-to-br from-red-700 to-orange-800' +
                ' active:from-red-700 active:to-orange-800' +
                ' hover from-red-600 hover:to-orange-700' +
                ' disabled:from-stone-600 disabled:to-slate-700'
            }
            onClick={handleAction}
            data-action={action.toString()}
            disabled={disabled || wait}>
            {action}
        </button>
    )
}
