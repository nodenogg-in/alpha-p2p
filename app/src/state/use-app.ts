import { computed, onBeforeUnmount, reactive, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { boolean } from 'valibot'

import { localReactive, localRef } from '@/utils/hooks/use-local-storage'
import { assign, createUserIdentity, isValidMicrocosmURI } from 'nodenoggin/utils'
import { DEFAULT_VIEW, type ViewName } from 'nodenoggin/schema'
import { KeyCommands } from 'nodenoggin/ui'
import { useRoute, useRouter } from 'vue-router'
import {
  createYMicrocosm,
  identitySchema,
  type MicrocosmReferenceMap,
  microcosmReferenceMap,
  sortMicrocosmsByName,
  defaultPointerState,
  Pointer,
  Manager
} from 'nodenoggin'

const MAIN_STORE_NAME = 'app' as const

const usePointer = () => {
  const pointer = readonly(new Pointer())

  const state = reactive(defaultPointerState())

  pointer.on('state', (s) => {
    assign(state.delta, s.delta)
    assign(state.point, s.point)
    assign(state.origin, s.origin)
    state.active = s.active
    state.visible = s.visible
    state.pinching = s.pinching
    state.touchDistance = s.touchDistance
    state.pointerType = s.pointerType
  })

  return {
    state,
    dispose: pointer.dispose
  }
}

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore(MAIN_STORE_NAME, () => {
  const router = useRouter()
  const route = useRoute()

  const identity = localReactive({
    name: [MAIN_STORE_NAME, 'identity'],
    schema: identitySchema,
    defaultValue: createUserIdentity()
  })

  const pointer = usePointer()

  const keys = readonly(new KeyCommands())
  const activeMicrocosm = ref<string>()
  const menuOpen = localRef({ name: 'menuOpen', schema: boolean(), defaultValue: true })
  const manager = Manager.init(identity.user_id, createYMicrocosm)

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosms = localReactive<MicrocosmReferenceMap>({
    name: [MAIN_STORE_NAME, 'microcosms'],
    schema: microcosmReferenceMap,
    defaultValue: new Map()
  })

  keys.onMany({
    m: () => {
      menuOpen.value = !menuOpen.value
    }
  })

  const registerMicrocosm = (microcosm_uri: string, view: ViewName) => {
    try {
      if (!isValidMicrocosmURI(microcosm_uri)) {
        throw new Error(`Invalid microcosm URI: ${microcosm_uri}`)
      }
      activeMicrocosm.value = microcosm_uri
      return manager.register({
        microcosm_uri,
        view
      })
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${microcosm_uri}`)
    }
  }

  manager.on('microcosms', (m) => {
    for (const [uri, ref] of m) {
      microcosms.set(uri, ref)
    }
  })

  const isActiveMicrocosm = (microcosm_uri: string) => activeMicrocosm.value === microcosm_uri

  const gotoMicrocosm = ({
    microcosm_uri = route.params.microcosm_uri as string,
    view
  }: {
    microcosm_uri?: string
    view?: string
  }) => {
    const existing = microcosms.get(microcosm_uri)
    if (existing && !view) {
      view = existing.view
    } else if (!existing && !view) {
      view = DEFAULT_VIEW
    }

    router.push({
      name: 'microcosm',
      params: {
        view,
        microcosm_uri
      }
    })
  }

  onBeforeUnmount(() => {
    pointer.dispose()
  })

  console.log('app store')
  return {
    menuOpen,
    identity,
    pointer: readonly(pointer.state),
    activeMicrocosm: readonly(activeMicrocosm),
    microcosms: computed(() => sortMicrocosmsByName(microcosms)),
    onKeyCommand: keys.onMany,
    isActiveMicrocosm,
    registerMicrocosm,
    gotoMicrocosm
  }
})

export type AppState = ReturnType<typeof useApp>
