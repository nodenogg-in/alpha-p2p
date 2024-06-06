import { type Identity, createIdentityID, isValidIdentityID } from '@nodenogg.in/microcosm'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { type Signal, signal, persist } from '@figureland/statekit'
import { isObject, isUndefined, isString, isSet } from '@figureland/typekit/guards'
import { getPersistenceName } from './create-app'
import {
  type SerializedKeyPair,
  createKeypair,
  exportKeyPair,
  importKeypair,
  isValidSerializedKeypair
} from '@nodenogg.in/microcosm/crypto'

export const isIdentity = (i: unknown): i is Identity => {
  const result = isObject(i) && 'identityID' in i && isValidIdentityID(i.identityID)
  const withNickname = result
    ? 'nickname' in i
      ? isUndefined(i.nickname) || isString(i.nickname)
      : true
    : false

  return result && withNickname
}

type IdentityState = Identity | undefined

export const createIdentitySession = (): IdentitySession => {
  const state = signal<IdentityState>(() => undefined as unknown as Identity)

  const createIdentity = async (): Promise<IdentityState> => {
    const identity: Identity = {
      identityID: createIdentityID()
    }
    return identity
  }

  persist(
    state,
    typedLocalStorage({
      name: getPersistenceName(['identity']),
      validate: (v): v is IdentityState => isIdentity(v),
      fallback: createIdentity
    })
  )

  const keypairStorage = typedLocalStorage({
    name: getPersistenceName(['identity', 'keypair']),
    validate: isValidSerializedKeypair,
    fallback: async (): Promise<SerializedKeyPair> => {
      const keys = await createKeypair()
      return await exportKeyPair(keys)
    }
  })

  keypairStorage.get()

  const getKeypair = async (): Promise<CryptoKeyPair | undefined> => {
    try {
      const serialized = await keypairStorage.get()
      return await importKeypair(serialized)
    } catch (error) {
      return undefined
    }
  }

  return {
    ...state,
    getKeypair
  }
}

export type IdentitySession = Signal<IdentityState> & {
  getKeypair: () => Promise<CryptoKeyPair | undefined>
}
