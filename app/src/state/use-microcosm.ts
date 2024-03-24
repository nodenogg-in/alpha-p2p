import { defineStore } from 'pinia'
import { inject } from 'vue'

import { useState } from '@nodenogg.in/statekit/vue'
import { microcosms } from '@/state'
import type { Microcosm_URI } from '@nodenogg.in/microcosm'

export const useMicrocosm = async (microcosm_uri: Microcosm_URI) => {
  const microcosm = await microcosms.register({ microcosm_uri })

  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const status = useState(microcosm, 'status')
    const identities = useState(microcosm, 'identities')

    const getUser = (identity_uid: string) => {
      return undefined
      // identities.find((i) => i.identity_uid === identity_uid)
    }

    return {
      api: () => microcosm,
      microcosm_uri,
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
