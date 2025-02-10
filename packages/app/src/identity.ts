import { createIdentityID, isValidIdentityID, type Identity } from '@nodenogg.in/microcosm'
import { storage } from '@figureland/kit/state/local-storage'
import { state, persist, extend, type State } from '@figureland/kit/state'
import { isObject, isUndefined, isString } from '@figureland/kit/tools/guards'
import { getPersistenceName } from './create-app'
import {
  createKeypair,
  exportKeyPair,
  importKeypair,
  isValidSerializedKeypair,
  type SerializedKeyPair
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

const createIdentity = async (): Promise<IdentityState> => ({
  identityID: createIdentityID()
})

export const createIdentitySession = (): IdentitySession => {
  const store = state<IdentityState>(undefined)

  persist(
    store,
    storage<IdentityState>({
      name: getPersistenceName(['identity']),
      validate: (v): v is IdentityState => isIdentity(v),
      fallback: createIdentity
    })
  )

  const keypairStorage = storage({
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

  return extend(store, {
    getKeypair
  })
}

export type IdentitySession = State<IdentityState> & {
  getKeypair: () => Promise<CryptoKeyPair | undefined>
}
