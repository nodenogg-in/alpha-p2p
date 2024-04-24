import { signal, persist, manager } from '@figureland/statekit'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { isMap, sortMapToArray } from '@figureland/typekit'
import {
  type MicrocosmReference,
  MicrocosmID,
  createTimestamp,
  isValidMicrocosmID
} from '@nodenogg.in/microcosm'
import { getPersistenceName } from './create-app'

export type MicrocosmEntryRequest = {
  microcosmID: MicrocosmID
  view?: string
  password?: string
}

export const createSession = () => {
  const { use, dispose } = manager()
  const state = use(
    signal<Map<MicrocosmID, MicrocosmReference>>(() => new Map<MicrocosmID, MicrocosmReference>())
  )
  const active = use(signal<MicrocosmID | undefined>(() => undefined))
  const ready = use(signal(() => false))
  const microcosms = use(
    signal((get) =>
      sortMapToArray(get(state), 'microcosmID').filter((m) => isValidMicrocosmID(m.microcosmID))
    )
  )

  persist(
    state,
    typedLocalStorage({
      name: getPersistenceName(['session', 'microcosms']),
      validate: isMap,
      fallback: state.get
    })
  )

  const remove = (microcosmID: MicrocosmID) => {
    state.mutate((microcosms) => {
      microcosms.delete(microcosmID)
    })
  }

  const register = ({ microcosmID, view, password }: MicrocosmEntryRequest): MicrocosmReference => {
    const existing = state.get().get(microcosmID)
    const updatedReference = {
      microcosmID,
      lastAccessed: createTimestamp(),
      password: password || existing?.password,
      view: view || (existing?.view as string)
    }
    state.mutate((microcosms) => {
      microcosms.set(microcosmID, updatedReference)
    })
    return updatedReference
  }

  const isActive = (microcosmID: MicrocosmID) => active.get() === microcosmID
  const setActive = (microcosmID: MicrocosmID) => active.set(microcosmID)

  ready.set(true)

  return {
    ready,
    active,
    microcosms,
    remove,
    register,
    isActive,
    setActive,
    dispose
  }
}

export type Session = ReturnType<typeof createSession>
