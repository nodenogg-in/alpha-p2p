import { defineStore } from 'pinia'
import { inject, type Ref } from 'vue'
import { vue } from '@figureland/kit/state/vue'
import {
  type EntityLocation,
  parseMicrocosmID,
  type MicrocosmID,
  type IdentityWithStatus,
  type Entity
} from '@nodenogg.in/microcosm'
import { app, client } from './app'

export const useMicrocosm = async (microcosmID: MicrocosmID) => {
  const microcosm = await client.register({ microcosmID })
  const id = client.identity.get()
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

    // const entities = vue(microcosm.entities) as Ref<Map<string, Entity>>
    const entities = vue(microcosm.entities.derive((e) => Array.from(e.values())))

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
    api: typeof app
  }
