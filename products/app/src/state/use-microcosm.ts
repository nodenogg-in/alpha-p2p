import { defineStore } from 'pinia'
import { inject } from 'vue'

import { useState } from '@figureland/statekit/vue'
import type { MicrocosmID } from '@nodenogg.in/microcosm'
import { parseMicrocosmID } from '@nodenogg.in/microcosm'
import { app } from './app'

export const useMicrocosm = async (microcosmID: MicrocosmID) => {
  const microcosm = await app.microcosms.registerMicrocosm({ microcosmID })

  return defineStore(`microcosm/${microcosmID}`, () => {
    const status = useState(microcosm, 'status')
    const identities = useState(microcosm, 'identities')

    const getUser = (identityID: string) => {
      return undefined
      // identities.find((i) => i.IdentityID === IdentityID)
    }

    return {
      ...parseMicrocosmID(microcosmID),
      api: () => microcosm,
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
