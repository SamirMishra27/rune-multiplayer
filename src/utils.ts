export function getRandInt(start: number, end: number): number {
    return Math.floor(Math.random() * (end + 1) + start)
}

export const sleep = async (duration: number) =>
    new Promise((resolve) => setTimeout(resolve, duration))
