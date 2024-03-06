import { customRef, type Ref } from 'vue'
import { isString, State, type StateType } from 'nodenoggin/utils'

export const useState = <S extends object, K extends (string & keyof S) | undefined = undefined>(
  state: State<S>,
  key?: K
) =>
  customRef((track, set) => ({
    get: () => {
      track()
      if (isString(key)) {
        return state.getKey(key) as K extends keyof S ? S[K] : never
      } else {
        return state.get() as K extends undefined ? S : never
      }
    },
    set,
    dispose: state.on(set)
  })) as K extends keyof S ? Ref<S[K]> : Ref<S>

export const useDerived = <States extends State<object>[], R>(
  states: [...States],
  derive: (states: { [K in keyof States]: StateType<States[K]> }) => R
) => {
  return customRef<R>((track, set) => {
    const load = (): R =>
      derive(
        states.map((state) => state.get()) as {
          [K in keyof States]: StateType<States[K]>
        }
      )

    const subs = states.map((s) => s.on(track))

    const dispose = () => {
      subs.forEach((sub) => sub())
    }
    return {
      dispose,
      get: () => {
        track()
        return load()
      },
      set
    }
  })
}
