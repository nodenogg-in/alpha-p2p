import { Equality } from '../equals'
import { State } from './State'

export type StateType<S> = S extends State<infer T> ? T : never

type DeriveStateOptions = {
  throttle?: number
  equality?: Equality
}
export const deriveState = <States extends State<object>[], R extends object>(
  states: [...States],
  derive: (states: { [K in keyof States]: StateType<States[K]> }) => R,
  options: DeriveStateOptions = {}
) => {
  const load = (): R =>
    derive(
      states.map((state) => state.get()) as {
        [K in keyof States]: StateType<States[K]>
      }
    )
  const state = new State<R>({
    initial: load,
    ...options
  })
  const subs = states.map((s) => s.on(() => state.set(load())))
  state.onDispose(() => {
    subs.forEach((sub) => sub())
  })
  return state
}
