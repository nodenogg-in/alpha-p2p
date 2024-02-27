import { reactive, ref, type UnwrapRef } from 'vue'
import type { State } from 'nodenoggin/utils'

export const useState = <S extends object>(state: State<S>, onChange?: (value: S) => void) => {
  const r = reactive<S>(state.get())

  const handler = (newState: S) => {
    Object.assign(r, newState)
    if (onChange) {
      onChange(newState)
    }
  }

  state.on(handler)
  return r
}

export const useDerivedState = <S extends object, R extends object>(
  state: State<S>,
  compute: (value: S) => R
) => {
  const r = reactive<R>(compute(state.get()))

  const handler = (newState: S) => {
    Object.assign(r, compute(newState))
  }

  state.on(handler)
  return r
}

export const useDerivedRef = <S extends object, R>(state: State<S>, compute: (value: S) => R) => {
  const r = ref<R>(compute(state.get()))

  const handler = (newState: S) => {
    r.value = compute(newState) as UnwrapRef<R>
  }

  state.on(handler)
  return r
}
