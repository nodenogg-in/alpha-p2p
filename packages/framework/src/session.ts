import { signal, persist } from '@figureland/statekit'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { isMap, isObject, sortMapToArray } from '@figureland/typekit'
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
  const state = signal<Map<MicrocosmID, MicrocosmReference>>(
    () => new Map<MicrocosmID, MicrocosmReference>()
  )
  const active = signal<MicrocosmID | undefined>(() => undefined)
  const ready = signal(() => false)
  const microcosms = signal((get) =>
    sortMapToArray(get(state), 'microcosmID').filter((m) => isValidMicrocosmID(m.microcosmID))
  )

  persist(
    state,
    typedLocalStorage({
      name: getPersistenceName(['session', 'microcosms']),
      validate: isMap,
      fallback: state.get
    })
  )

  const removeReference = (microcosmID: MicrocosmID) => {
    state.mutate((microcosms) => {
      microcosms.delete(microcosmID)
    })
  }

  const registerReference = ({
    microcosmID,
    view,
    password
  }: MicrocosmEntryRequest): MicrocosmReference => {
    const existing = state.get().get(microcosmID)
    const updatedReference = {
      microcosmID,
      lastAccessed: createTimestamp(),
      password: password || existing?.password,
      view: view || (existing?.view as string)
    }
    state.set((microcosms) => new Map(microcosms).set(microcosmID, updatedReference))
    return updatedReference
  }

  const getReference = (microcosmID: MicrocosmID): MicrocosmReference | false => {
    const reference = state.get().get(microcosmID)
    if (!reference) {
      return false
    }
    registerReference({ microcosmID })
    return reference
  }
  const isActive = (microcosmID: MicrocosmID) => active.get() === microcosmID
  const setActive = (microcosmID: MicrocosmID) => active.set(microcosmID)

  const dispose = () => {
    ready.dispose()
    active.dispose()
    microcosms.dispose()
    state.dispose()
  }

  ready.set(true)

  return {
    ready,
    active,
    microcosms,
    removeReference,
    registerReference,
    getReference,
    isActive,
    setActive,
    dispose
  }
}

export type Session = ReturnType<typeof createSession>
