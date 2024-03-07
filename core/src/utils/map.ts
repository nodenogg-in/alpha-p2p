export const getOrSet = <T>(map: Map<string, T>, key: string, value: T) => {
  if (map.has(key)) {
    return map.get(key) as T
  } else {
    map.set(key, value)
    return value
  }
}
