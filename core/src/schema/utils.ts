export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export const isObject = (n: unknown): n is object => typeof n === 'object' && n !== null

export type Unsubscribe = () => void

export const paramToString = <T extends string>(param: string | string[]): T =>
  Array.isArray(param) ? (param.join('') as T) : (param as T)
