type ValueOf<T> = T[keyof T]
type Entries<T> = [keyof T, ValueOf<T>][]

export const entries = <T extends object>(obj: T): Entries<T> => Object.entries(obj) as Entries<T>

export const keys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[]

export const values = <T extends object>(obj: T) => Object.values(obj) as ValueOf<T>[]

export const assign = <T extends object, U extends object>(obj: T, ...objs: U[]) =>
  Object.assign(obj, ...objs)

export const is = <T>(a: T, b: T) => a === b || Object.is(a, b)

export const has = <O extends any, K extends keyof O & any>(o: O, k: K) =>
  Object.prototype.hasOwnProperty.call(o, k as keyof O)

export const sortMapToArray = <O extends object, K extends keyof O & string>(
  map: Map<string, O>,
  prop: K
): O[] =>
  Array.from(map.values()).sort((a, b) => (a[prop] as string).localeCompare(b[prop] as string))

export class NiceMap<K, V> extends Map<K, V> {
  public getOrSet = <Value extends V>(key: K, fn: () => Value) => {
    if (this.has(key)) {
      return this.get(key) as Value
    } else {
      const v = fn()
      this.set(key, v)
      return v as Value
    }
  }
}
