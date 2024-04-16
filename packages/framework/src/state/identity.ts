import { createIdentityID, identitySchema } from '@nodenogg.in/microcosm'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { persist, signalObject } from '@figureland/statekit'
import { is } from 'valibot'
import { getPersistenceName } from '../create-app'

export const createIdentitySession = () => {
  const state = signalObject({
    identityID: createIdentityID(),
    username: undefined
  })

  persist(
    state,
    typedLocalStorage({
      name: getPersistenceName(['identity']),
      validate: (v) => is(identitySchema, v),
      fallback: state.get
    })
  )

  return state
}

export type IdentitySession = ReturnType<typeof createIdentitySession>
