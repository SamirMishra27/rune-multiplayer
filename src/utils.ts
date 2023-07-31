export function getRandInt(start: number, end: number): number {
    return Math.floor(Math.random() * (end + 1) + start)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRandChoice(iterable: Array<any>): any {
    return iterable[getRandInt(0, iterable.length - 1)]
}

export const sleep = async (duration: number) =>
    new Promise((resolve) => setTimeout(resolve, duration))
