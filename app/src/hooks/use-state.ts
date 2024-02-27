import { reactive } from 'vue'
import type { MicroState } from 'node_modules/nodenoggin/src/utils/emitter/MicroState'

export const useState = <S extends object>(state: MicroState<S>, onChange?: (value: S) => void) => {
  const initial = { ...state.get() }
  const r = reactive<S>(initial)

  const handler = (newState: S) => {
    Object.assign(r, newState)
    if (onChange) {
      onChange(newState)
    }
  }

  state.on(handler)
  return r
}

// export const useDerivedState = <
//   S extends StateStore,
//   K extends string & keyof S,
//   R extends StateObject
// >(
//   state: State<S>,
//   name: K,
//   compute: (value: S[K]) => R
// ) => {
//   const value = reactive<R>(compute(state.get(name)))

//   useState(state, name, (v) => {
//     const computed = compute(v)
//     deepAssign(value, computed as UnwrapNestedRefs<R>)
//   })

//   return value
// }

// export const useDerivedValue = <S extends StateStore, K extends string & keyof S, R>(
//   state: State<S>,
//   name: K,
//   compute: (value: S[K]) => R
// ) => {
//   const r = ref<R>(compute(state.get(name)))

//   useState(state, name, (v) => {
//     r.value = compute(v) as UnwrapRef<R>
//   })

//   return r
// }

// export const useDerivedValueExp = <
//   S extends StateStore,
//   K extends string & keyof S,
//   R extends object
// >(
//   state: State<S>,
//   names: K[],
//   compute?: (value: S[K][]) => R
// ) => {
//   const initialData = names.map((n) => state.get(n))
//   if (compute) {
//     const r = reactive<R>(compute(initialData))

//     const handler = (data: S[K][]) => {
//       Object.assign(r, compute(data))
//     }

//     state.on(names, (data) => handler(data))

//     return r as R
//   } else {
//     const r = reactive<S[K][]>(initialData)

//     const handler = (data: S[K][]) => {
//       data.forEach((v, i) => {
//         deepAssign(r[i], v as S[K] as any)
//       })
//     }

//     state.on(names, (data) => handler(data))
//     return r
//   }
// }
