import { reactive, watch, type UnwrapNestedRefs } from 'vue'
import { type State, type StateStore, deepAssign } from 'nodenoggin/utils'

export const useStateInstance = <S extends StateStore, K extends string & keyof S>(
  state: State<S>,
  name: K,
  onChange?: (value: UnwrapNestedRefs<S[K]>) => void
) => {
  const value = reactive<S[K]>(state.get(name))

  // Watch our reactive value and persist changes to local storage

  const handler = (newState: S[K]) => {
    deepAssign(value, newState as UnwrapNestedRefs<S[K]>)
    if (onChange) onChange(value)
  }

  watch(
    value,
    (newValue) => {
      state.set(name, newValue as S[K], false)
    },
    { flush: 'post' }
  )

  state.on(name, handler)
  return value
}
