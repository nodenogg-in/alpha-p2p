import { defineStore } from 'pinia'
import { inject } from 'vue'
import { vue } from '@figureland/kit/state/vue'
import { type Identity, type MicrocosmUUID, microcosm as microcosmAPI } from '@nodenogg.in/core'
import { app, client } from './app'

export const useMicrocosm = async (microcosmUUID: MicrocosmUUID) => {
  const microcosm = await client.register({ microcosmUUID })
  const id = client.identity.get()
  if (id) {
    await microcosm.identify(id.uuid)
    microcosm.join(id)
  }

  return defineStore(`microcosm/${microcosmUUID}`, () => {
    const status = vue(microcosm.state)
    const identities: Identity[] = []

    const getUser = (identityID: string) => {
      return undefined
    }

    const entities = vue(
      microcosm.entities.derive((e) =>
        Array.from(e.values()).sort((a, b) => (b.created || 0) - (a.created || 0))
      )
    )

    return {
      uuid: microcosmUUID,
      api: microcosm,
      entities,
      microcosmUUID,
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
