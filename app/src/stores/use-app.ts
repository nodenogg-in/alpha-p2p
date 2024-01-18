import { defineStore } from 'pinia'
import { map, string } from 'valibot'

import { createTimestamp, createUuid } from '@/utils'
import { localReactive } from '@/utils/local-storage'
import { microcosmSchema, type Microcosm, identitySchema, type Identity } from '@/types/schema'
import { Keybindings } from '@/utils/Keybindings'

const MAIN_STORE_NAME = 'app' as const

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore(MAIN_STORE_NAME, (): AppState => {
  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms

  const microcosms = localReactive([MAIN_STORE_NAME], map(string(), microcosmSchema), new Map())

  const keys = new Keybindings()
  keys.init()

  // keys.on('copy', () => alert('Copy'))
  // keys.on('cut', () => alert('Cut'))
  // keys.on('paste', () => alert('Paste!'))

  const identity = localReactive('identity', identitySchema, {
    user_id: createUuid()
  })

  const registerMicrocosm = (microcosm_uri: string) => {
    const microcosmEntry: Microcosm = {
      microcosm_uri,
      lastAccessed: createTimestamp()
    }

    microcosms.set(microcosm_uri, microcosmEntry)
  }

  return {
    keys,
    identity,
    registerMicrocosm,
    microcosms
  }
})

export type AppState = {
  keys: Keybindings
  identity: Identity
  registerMicrocosm: (uri: string) => void
  microcosms: Map<string, Microcosm>
}
