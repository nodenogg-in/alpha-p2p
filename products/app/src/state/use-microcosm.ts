import { defineStore } from 'pinia'
import { inject, type Ref } from 'vue'
import { vue } from '@figureland/kit/state/vue'
import {
  type EntityLocation,
  parseMicrocosmID,
  type MicrocosmID,
  type IdentityWithStatus
} from '@nodenogg.in/microcosm'
import { app, type AppMicrocosmAPI } from './app'

export const useMicrocosm = async (microcosmID: MicrocosmID) => {
  const microcosm = await app.microcosms.register({ microcosmID })
  const id = app.identity.get()
  if (id) {
    await microcosm.identify(id.identityID)
    microcosm.join(id)
  }

  // microcosm.dispose()

  return defineStore(`microcosm/${microcosmID}`, () => {
    const status = vue(microcosm.state)
    const identities: IdentityWithStatus[] = []

    const getUser = (identityID: string) => {
      return undefined
      // identities.find((i) => i.IdentityID === IdentityID)
    }
    // const entities = ref([])
    // microcosm.query.ids.on((i) => {
    //   console.log(i)
    //   entities.value = i
    // })

    const entities = vue(microcosm.query.ids) as Ref<EntityLocation[]>

    return {
      ...parseMicrocosmID(microcosmID),
      api: microcosm,
      entities,
      microcosmID,
      getUser,
      status,
      identities
    }
  })()
}

export type MicrocosmStore = Awaited<ReturnType<typeof useMicrocosm>>

export const MICROCOSM_DATA_INJECTION_KEY = Symbol()

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore & {
    api: AppMicrocosmAPI
  }
