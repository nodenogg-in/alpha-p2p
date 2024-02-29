import { defineStore } from 'pinia'
import { inject, customRef, watch } from 'vue'

import type { MicrocosmAPI, MicrocosmAPIStatus } from 'nodenoggin/sync'
import { type IdentityWithStatus, type NodeReference } from 'nodenoggin/schema'
import { useState } from '@/hooks/use-state'
import { ui, api } from '@/state/instance'

export const useMicrocosm = (microcosm_uri: string) => {
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

    const useCollection = createCollectionHook(microcosm.api)

    join()

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
  useCollection: ReturnType<typeof createCollectionHook>
  api: () => ReturnType<typeof api.register>['api']
}

export const MICROCOSM_DATA_INJECTION_KEY = 'MICROCOSM_DATA'

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore

const createCollectionHook = (api: MicrocosmAPI) => (user_id: string) =>
  customRef<NodeReference[]>((track, set) => ({
    dispose: api.subscribeToCollection(user_id, set),
    get() {
      track()
      return api.getCollection(user_id)
    },
    set
  }))
