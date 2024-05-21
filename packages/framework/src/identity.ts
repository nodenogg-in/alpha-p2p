import { type Identity, createIdentityID, isValidIdentityID } from '@nodenogg.in/microcosm'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { type SignalObject, signalObject, signal, persist } from '@figureland/statekit'
import { isObject, isUndefined, isString } from '@figureland/typekit/guards'
import { getPersistenceName } from './create-app'
import {
  type SerializedKeyPair,
  createBlankKeypair,
  createKeypair,
  exportKeyPair,
  importKeypair,
  isValidSerializedKeypair
} from '@nodenogg.in/microcosm/crypto'

export const isIdentity = (i: unknown): i is Identity =>
  isObject(i) &&
  'identityID' in i &&
  'nickname' in i &&
  isValidIdentityID(i.identityID) &&
  (isUndefined(i.nickname) || isString(i.nickname))

export const createIdentitySession = (): IdentitySession => {
  const state = signalObject<Identity>({
    identityID: createIdentityID(),
    nickname: undefined
  })

  persist(
    state,
    typedLocalStorage({
      name: getPersistenceName(['identity']),
      validate: isIdentity
    })
  )

  const storedKeypair = signal<SerializedKeyPair>(createBlankKeypair)

  persist(
    storedKeypair,
    typedLocalStorage({
      name: getPersistenceName(['identity', 'keypair']),
      validate: isValidSerializedKeypair
    })
  )

  const getKeypair = async (): Promise<CryptoKeyPair | undefined> => {
    try {
      try {
        const keys = await importKeypair(storedKeypair.get())
        return keys
      } catch {
        const keys = await createKeypair()
        storedKeypair.set(await exportKeyPair(keys))
        return keys
      }
    } catch {
      return undefined
    }
  }

  storedKeypair.on(getKeypair)

  return {
    ...state,
    getKeypair
  }
}

export type IdentitySession = SignalObject<Identity> & {
  getKeypair: () => Promise<CryptoKeyPair | undefined>
}
