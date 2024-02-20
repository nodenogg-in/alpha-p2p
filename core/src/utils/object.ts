export const assign = <T extends object>(target: T, ...update: Partial<T>[]): T =>
  Object.assign(target, ...update)

export const deepAssign = <T extends object>(target: T, u: Partial<T>): T => {
  for (const [k, v] of Object.entries(u)) {
    if (typeof v === 'object' && v !== null) {
      if (Array.isArray(v)) {
        target[k] = [...v]
      } else {
        target[k] = deepAssign(target[k], v)
      }
    } else {
      target[k] = v
    }
  }

  return target
}
