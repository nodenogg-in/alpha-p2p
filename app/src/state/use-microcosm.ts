import { defineStore } from 'pinia'
import { inject } from 'vue'

import type { IdentityWithStatus } from '@nodenogg.in/schema'
import { useState } from '@/hooks/use-state'
import { api } from '@/state'

export const useMicrocosm = (microcosm_uri: string) => {
  const Microcosm = api.registerMicrocosm({ microcosm_uri })
  return defineStore(`Microcosm/${microcosm_uri}`, () => {
    const status = useState(Microcosm, 'status')
    const identities = useState(Microcosm, 'identities')

    const getUser = (user_id: string): IdentityWithStatus | undefined =>
      identities.value.find((i) => i.user_id === user_id)

    return {
      api: () => Microcosm,
      microcosm_uri,
      getUser,
      status,
      identities
    }
  })()
}

export type MicrocosmStore = ReturnType<typeof useMicrocosm>

export const MicROCOSM_DATA_INJECTION_KEY = 'MicROCOSM_DATA'

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MicROCOSM_DATA_INJECTION_KEY) as MicrocosmStore
