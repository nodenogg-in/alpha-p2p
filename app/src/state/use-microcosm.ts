import { defineStore } from 'pinia'
import { inject } from 'vue'

import type { IdentityWithStatus } from '@nodenogg.in/schema'
import { useState } from '@nodenogg.in/state/vue'
import { microcosms } from '@/state'

export const useMicrocosm = async (microcosm_uri: string) => {
  const microcosm = await microcosms.register({ microcosm_uri })

  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const status = useState(microcosm, 'status')
    const identities = useState(microcosm, 'identities')

    const getUser = (user_id: string): IdentityWithStatus | undefined => {
      // identities.value.find((i) => i.user_id === user_id)
      return undefined
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
