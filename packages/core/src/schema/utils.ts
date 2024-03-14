export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export type Unsubscribe = () => void

export const paramToString = <T extends string>(param: string | string[]): T =>
  Array.isArray(param) ? (param.join('') as T) : (param as T)
