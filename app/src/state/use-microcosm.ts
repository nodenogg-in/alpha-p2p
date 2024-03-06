import { defineStore } from 'pinia'
import { inject, watch, type Ref, customRef } from 'vue'

import type { MicrocosmAPIStatus } from 'nodenoggin/sync'
import type { IdentityWithStatus, NodeReference } from 'nodenoggin/schema'
import { useState } from '@/hooks/use-state'
import { api, type API } from '@/state/instance'

export const useMicrocosm = (microcosm_uri: string): MicrocosmStore => {
  const microcosm = api.register({ microcosm_uri })
  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const status = useState(microcosm.api, 'status')
    const identities = useState(microcosm.api, 'identities')

    const getUser = (user_id: string): IdentityWithStatus | undefined =>
      identities.value.find((i) => i.user_id === user_id)

    watch(identities, () => {
      console.log(identities.value)
    })

    const useCollection = (user_id: string) =>
      customRef<NodeReference[]>((track, set) => ({
        dispose: microcosm.api.subscribeToCollection(user_id, set),
        get() {
          track()
          return microcosm.api.getCollection(user_id)
        },
        set
      }))

    return {
      api: () => microcosm.api,
      useCollection,
      microcosm_uri,
      getUser,
      status,
      identities
    }
  })()
}

export type MicrocosmStore = {
  microcosm_uri: string
  status: MicrocosmAPIStatus
  identities: IdentityWithStatus[]
  getUser: (user_id: string) => IdentityWithStatus | undefined
  useCollection: (user_id: string) => Ref<NodeReference[]>
  api: () => ReturnType<API['register']>['api']
}

export const MICROCOSM_DATA_INJECTION_KEY = 'MICROCOSM_DATA'

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore
