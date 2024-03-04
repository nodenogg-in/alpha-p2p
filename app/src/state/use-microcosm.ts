import { defineStore } from 'pinia'
import { inject, watch, type Ref, customRef } from 'vue'

import type { MicrocosmAPIStatus } from 'nodenoggin/sync'
import type { IdentityWithStatus, NodeReference } from 'nodenoggin/schema'
import { useState } from '@/hooks/use-state'
import { ui, api, type API } from '@/state/instance'

export const useMicrocosm = (microcosm_uri: string): MicrocosmStore => {
  const microcosm = api.register({ microcosm_uri })
  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const status = useState(microcosm.api, 'status')
    const identities = useState(microcosm.api, 'identities')
    const collections = useState(microcosm.api, 'collections')

    ui.keyboard.onCommand({
      redo: () => {
        if (api.isActive(microcosm_uri)) {
          microcosm.api.redo()
        }
      },
      undo: () => {
        if (api.isActive(microcosm_uri)) {
          microcosm.api.undo()
        }
      }
    })

    const join = () => {
      microcosm.api.join(api.user.getKey('username'))
    }

    const leave = () => {
      microcosm.api.leave(api.user.getKey('username'))
    }

    api.user.onKey('username', () => {
      join()
    })

    const getUser = (user_id: string): IdentityWithStatus | undefined =>
      identities.value.find((i) => i.user_id === user_id)

    watch(identities, () => {
      console.log(identities.value)
    })

    join()

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
      join,
      leave,
      microcosm_uri,
      getUser,
      status,
      collections,
      identities
    }
  })()
}

export type MicrocosmStore = {
  microcosm_uri: string
  status: MicrocosmAPIStatus
  identities: IdentityWithStatus[]
  join: () => void
  leave: () => void
  getUser: (user_id: string) => IdentityWithStatus | undefined
  collections: string[]
  useCollection: (user_id: string) => Ref<NodeReference[]>
  api: () => ReturnType<API['register']>['api']
}

export const MICROCOSM_DATA_INJECTION_KEY = 'MICROCOSM_DATA'

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore
