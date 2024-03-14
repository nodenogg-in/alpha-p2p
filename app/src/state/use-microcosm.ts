import { defineStore } from 'pinia'
import { inject } from 'vue'

import type { IdentityWithStatus } from '@nodenogg.in/core/schema'
import { useState } from '@/hooks/use-state'
import { api } from '@/state'

export const useMicrocosm = (microcosm_uri: string) => {
  const microcosm = api.registerMicrocosm({ microcosm_uri })
  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const status = useState(microcosm.api, 'status')
    const identities = useState(microcosm.api, 'identities')

    const getUser = (user_id: string): IdentityWithStatus | undefined =>
      identities.value.find((i) => i.user_id === user_id)

    return {
      api: () => microcosm.api,
      microcosm_uri,
      getUser,
      status,
      identities
    }
  })()
}

export type MicrocosmStore = ReturnType<typeof useMicrocosm>

export const MICROCOSM_DATA_INJECTION_KEY = 'MICROCOSM_DATA'

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore
