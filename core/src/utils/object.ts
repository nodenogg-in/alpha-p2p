export const assign = <T extends object>(target: T, ...update: Partial<T>[]): T =>
  Object.assign(target, ...update)
