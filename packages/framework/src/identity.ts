import { type Identity, createIdentityID, isValidIdentityID } from '@nodenogg.in/microcosm'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { type Signal, signal, persist } from '@figureland/statekit'
import { isObject, isUndefined, isString, isSet } from '@figureland/typekit/guards'
import { getPersistenceName } from './create-app'
import {
  type SerializedKeyPair,
  createBlankKeypair,
  createKeypair,
  exportKeyPair,
  importKeypair,
  isValidSerializedKeypair
} from '@nodenogg.in/microcosm/crypto'

const createIdentity = () => ({ identityID: createIdentityID() })

export const isIdentity = (i: unknown): i is Identity =>
  isObject(i) && 'identityID' in i && isValidIdentityID(i.identityID) && 'nickname' in i
    ? isUndefined(i.nickname) || isString(i.nickname)
    : true

export const createIdentitySession = (): IdentitySession => {
  const state = signal<Identity>(createIdentity)

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

export type IdentitySession = Signal<Identity> & {
  getKeypair: () => Promise<CryptoKeyPair | undefined>
}
