import { reactive, type UnwrapNestedRefs } from 'vue'
import {
  getLocalStorage,
  setLocalStorage,
  type State,
  type StateStore,
  type LocalStorageOptions,
  deepAssign
} from 'nodenoggin'

type EOptions<T extends Record<string, any>> = {
  onChange?: (value: UnwrapNestedRefs<T>) => void
  localStorage?: Omit<LocalStorageOptions<T>, 'defaultValue'>
}

export const useState = <S extends StateStore, K extends string & keyof S>(
  state: State<S>,
  name: K,
  { onChange, localStorage }: EOptions<S[K]> = {}
) => {
  const initialValue = state.get<K, S>(name)

  const value = reactive<S[K]>(initialValue)
  const handler = (newState: S[K]) => {
    deepAssign(value, newState as UnwrapNestedRefs<S[K]>)
    if (localStorage) {
      setLocalStorage(name, value)
    }
    if (onChange) {
      onChange(value)
    }
  }

  if (localStorage) {
    handler(getLocalStorage(name, localStorage.schema, initialValue))
  }

  state.on(name, handler)
  return value
}
