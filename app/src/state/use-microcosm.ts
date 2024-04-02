import { defineStore } from 'pinia'
import { inject } from 'vue'

import { useState } from '@nodenogg.in/statekit/vue'
import { microcosms } from '@/state'
import type { MicrocosmID } from '@nodenogg.in/microcosm'

export const useMicrocosm = async (microcosmID: MicrocosmID) => {
  const microcosm = await microcosms.register({ microcosmID })

  return defineStore(`microcosm/${microcosmID}`, () => {
    const status = useState(microcosm, 'status')
    const identities = useState(microcosm, 'identities')

    const getUser = (identityID: string) => {
      return undefined
      // identities.find((i) => i.IdentityID === IdentityID)
    }

    return {
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
