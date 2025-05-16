import { defineStore } from 'pinia'
import { inject } from 'vue'
import { vue } from '@figureland/kit/state/vue'
import { type Identity, type MicrocosmUUID, microcosm as microcosmAPI } from '@nodenogg.in/core'
import { app, client } from './app'

export const useMicrocosm = async (microcosmID: MicrocosmUUID) => {
  const microcosm = await client.register({ microcosmID })
  const id = client.identity.get()
  if (id) {
    await microcosm.identify(id.uuid)
    microcosm.join(id)
  }

  console.log('joining')

  // microcosm.dispose()

  return defineStore(`microcosm/${microcosmID}`, () => {
    const status = vue(microcosm.state)
    const identities: Identity[] = []

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
      ...microcosmAPI.parseMicrocosmUUID(microcosmID),
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
