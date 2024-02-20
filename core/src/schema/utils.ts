export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export const isObject = (n: unknown): n is object => typeof n === 'object' && n !== null
