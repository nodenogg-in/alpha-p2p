import { defineStore } from 'pinia'
import { inject, customRef } from 'vue'

import type { MicrocosmAPI } from 'nodenoggin/sync'
import type { IdentityWithStatus, NodeReference, ViewName } from 'nodenoggin/schema'
import { useState } from '@/hooks/use-state'
import { ui, microcosms, user } from '@/state/instance'

export const useMicrocosm = (microcosm_uri: string, view: ViewName) => {
  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const { api, actions } = microcosms.register({ microcosm_uri, view })
    const data = useState(api, 'data')

    ui.keyboard.onCommand({
      redo: () => {
        if (microcosms.isActive(microcosm_uri)) {
          api.redo()
        }
      },
      undo: () => {
        if (microcosms.isActive(microcosm_uri)) {
          api.undo()
        }
      }
    })

    const join = () => {
      microcosms.join(microcosm_uri)
    }

    const leave = () => {
      microcosms.leave(microcosm_uri)
    }

    const status = useState(api, 'status', (status) => {
      if (status.connected) {
        join()
      } else {
        leave()
      }
    })

    useState(user, 'identity', () => {
      if (status.ready) {
        join()
      }
    })

    const getUser = (user_id: string): IdentityWithStatus | undefined =>
      data.identities.find((i) => i.user_id === user_id)

    const useCollection = createCollectionHook(api)

    return {
      api,
      actions,
      useCollection,
      join,
      leave,
      microcosm_uri,
      getUser,
      status,
      data
    }
  })()
}

export type MicrocosmStore = ReturnType<typeof useMicrocosm>

export const MICROCOSM_DATA_INJECTION_KEY = 'MICROCOSM_DATA'

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore

const createCollectionHook = (api: MicrocosmAPI) => (user_id: string) =>
  customRef<NodeReference[]>((track, trigger) => {
    let value: NodeReference[] = []

    api.subscribeToCollection(user_id, (data) => {
      value = [...data]
      trigger()
    })

    return {
      get() {
        track()
        return value
      },
      set() {
        trigger()
      }
    }
  })
