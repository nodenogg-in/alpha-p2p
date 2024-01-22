import { defineStore } from 'pinia'
import { map, string } from 'valibot'

import { createTimestamp, createUuid } from '@/utils'
import { localReactive } from '@/utils/local-storage'
import { microcosmSchema, type Microcosm, identitySchema, type Identity } from '@/types/schema'
import { createKeybindings } from '@/utils/Keybindings'
import { SyncedMicrocosmManager } from '@/utils/yjs/SyncedMicrocosmManager'
import { SyncedMicrocosm } from '@/utils/yjs/SyncedMicrocosm'
import { onBeforeUnmount, readonly, ref, type Ref } from 'vue'

const MAIN_STORE_NAME = 'app' as const

export enum Tool {
  Move = 'move',
  Select = 'select',
  New = 'new'
}

export const isMoveTool = (mode: Tool): mode is Tool.Move => mode === Tool.Move
export const isSelectTool = (mode: Tool): mode is Tool.Select => mode === Tool.Select
export const isNewTool = (mode: Tool): mode is Tool.New => mode === Tool.New

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore(MAIN_STORE_NAME, (): AppState => {
  const identity = localReactive('identity', identitySchema, {
    user_id: createUuid()
  })

  const tool = ref<Tool>(Tool.Select)

  const manager = readonly<SyncedMicrocosmManager>(new SyncedMicrocosmManager(identity.user_id))

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosms = localReactive([MAIN_STORE_NAME], map(string(), microcosmSchema), new Map())

  const unsubscribe = createKeybindings({
    '$mod+C': () => {
      console.log('copy')
    },
    '$mod+X': () => {
      console.log('cut')
    },
    '$mod+V': () => {
      console.log('paste')
    },
    Escape: () => {
      tool.value = Tool.Select
    },
    n: () => {
      tool.value = Tool.New
    },
    v: () => {
      tool.value = Tool.Select
    },
    h: () => {
      tool.value = Tool.Move
    }
  })

  onBeforeUnmount(() => {
    unsubscribe()
  })

  const registerMicrocosm = (microcosm_uri: string) => {
    microcosms.set(microcosm_uri, {
      microcosm_uri,
      lastAccessed: createTimestamp()
    })
    return manager.register(microcosm_uri)
  }

  return {
    tool,
    identity,
    registerMicrocosm,
    microcosms
  }
})

export type AppState = {
  tool: Ref<Tool>
  identity: Identity
  registerMicrocosm: (uri: string) => SyncedMicrocosm
  microcosms: Map<string, Microcosm>
}
