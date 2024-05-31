import { defineStore } from 'pinia'
import { inject } from 'vue'

import { useSubscribable } from '@figureland/statekit/vue'
import { type EntityLocation, parseMicrocosmID, type MicrocosmID } from '@nodenogg.in/microcosm'
import { app } from './app'

export const useMicrocosm = async (microcosmID: MicrocosmID) => {
  const microcosm = await app.microcosms.register({ microcosmID })
  await microcosm.identify(app.identity.get().identityID)

  return defineStore(`microcosm/${microcosmID}`, () => {
    const status = useSubscribable(microcosm.state)
    const identities: any = []

    const getUser = (identityID: string) => {
      return undefined
      // identities.find((i) => i.IdentityID === IdentityID)
    }
    const entities = useSubscribable<EntityLocation[]>(microcosm.query.ids)

    return {
      ...parseMicrocosmID(microcosmID),
      api: () => microcosm,
      entities,
      microcosmID,
      getUser,
      status,
      identities
    }
  })()
}

export type MicrocosmStore = Awaited<ReturnType<typeof useMicrocosm>>

export const MICROCOSM_DATA_INJECTION_KEY = Symbol()

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore
