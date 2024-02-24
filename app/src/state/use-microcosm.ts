import { defineStore } from 'pinia'
import { inject, customRef } from 'vue'

import type { MicrocosmAPI } from 'nodenoggin/sync'
import {
  DEFAULT_VIEW,
  type IdentityWithStatus,
  type NodeReference,
  type ViewName
} from 'nodenoggin/schema'
import { useState } from '@/hooks/use-state'
import { ui, microcosms, user } from '@/state/instance'

export const useMicrocosm = (microcosm_uri: string) => {
  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const api = microcosms.register({ microcosm_uri, view: DEFAULT_VIEW })
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
      api.join(user.get('identity').username)
    }

    const leave = () => {
      api.leave(user.get('identity').username)
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

export type MicrocosmStore = ReturnType<typeof useMicrocosm> & {
  api: ReturnType<typeof microcosms.register>
}

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
