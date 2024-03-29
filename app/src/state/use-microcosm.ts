import { defineStore } from 'pinia'
import { inject } from 'vue'

import { useState } from '@nodenogg.in/statekit/vue'
import { microcosms } from '@/state'
import type { MicrocosmID } from '@nodenogg.in/microcosm'

export const useMicrocosm = async (MicrocosmID: MicrocosmID) => {
  const microcosm = await microcosms.register({ MicrocosmID })

  return defineStore(`microcosm/${MicrocosmID}`, () => {
    const status = useState(microcosm, 'status')
    const identities = useState(microcosm, 'identities')

    const getUser = (IdentityID: string) => {
      return undefined
      // identities.find((i) => i.IdentityID === IdentityID)
    }

    return {
      api: () => microcosm,
      MicrocosmID,
      getUser,
      status,
      identities
    }
  })()
}

export type MicrocosmStore = Awaited<ReturnType<typeof useMicrocosm>>

export const MICROCOSM_DATA_INJECTION_KEY = 'MICROCOSM_DATA'

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore
