import { Identity, createIdentityID } from '@nodenogg.in/microcosm'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { persist, signalObject } from '@figureland/statekit'
import { isObject } from '@figureland/typekit'
import { getPersistenceName } from './create-app'

export const isIdentity = (i: unknown): i is Identity =>
  isObject(i) &&
  'identityID' in i &&
  'nickname' in i &&
  typeof i.identityID === 'string' &&
  (i.nickname === undefined || typeof i.nickname === 'string')

export const createIdentitySession = () => {
  const state = signalObject<Identity>({
    identityID: createIdentityID(),
    nickname: undefined
  })

  return persist(
    state,
    typedLocalStorage({
      name: getPersistenceName(['identity']),
      validate: isIdentity,
      fallback: state.get
    })
  )
}

export type IdentitySession = ReturnType<typeof createIdentitySession>
