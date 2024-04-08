import { type ReadonlySignal, type SignalLike } from '.'

export const readonly = <S extends SignalLike>(s: S): ReadonlySignal<S> => ({
  id: s.id,
  get: s.get,
  on: s.on
})
