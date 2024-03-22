import { defineStore } from 'pinia'
import { inject } from 'vue'

import { useState } from '@nodenogg.in/state/vue'
import { microcosms } from '@/state'

export const useMicrocosm = async (microcosm_uri: string) => {
  const microcosm = await microcosms.register({ microcosm_uri })

  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const status = useState(microcosm, 'status')
    const identities = useState(microcosm, 'identities')

    console.log(status)
    console.log(identities)
    const getUser = (user_id: string) => {
      return undefined
      // identities.find((i) => i.user_id === user_id)
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
