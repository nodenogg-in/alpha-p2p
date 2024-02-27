import { defineStore } from 'pinia'
import { inject, customRef } from 'vue'

import type { MicrocosmAPI } from 'nodenoggin/sync'
import { DEFAULT_VIEW, type IdentityWithStatus, type NodeReference } from 'nodenoggin/schema'
import { useDerivedState, useState } from '@/hooks/use-state'
import { ui, api, user } from '@/state/instance'

export const useMicrocosm = (microcosm_uri: string) => {
  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const microcosm = api.register({ microcosm_uri, view: DEFAULT_VIEW })
    const status = useDerivedState(microcosm.api, ({ status }) => status)
    const data = useDerivedState(microcosm.api, ({ data }) => data)

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
      microcosm.api.join(user.getKey('username'))
    }

    const leave = () => {
      microcosm.api.leave(user.getKey('username'))
    }

    const state = useState(microcosm.api)

    useState(user, () => {
      // if (apiState.status.ready) {
      //   join()
      // }
    })

    const getUser = (user_id: string): IdentityWithStatus | undefined =>
      state.data.identities.find((i) => i.user_id === user_id)

    const useCollection = createCollectionHook(microcosm.api)

    return {
      api: () => microcosm.api,
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
  api: ReturnType<typeof api.register>
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
