import { identity, type Identity } from '@nodenogg.in/core'
import { storage } from '@figureland/kit/state/local-storage'
import { state, persist, extend, type State } from '@figureland/kit/state'
import { isObject, isUndefined, isString } from '@figureland/kit/tools/guards'
import { getPersistenceName } from './create-app'
// import {
//   createKeypair,
//   exportKeyPair,
//   importKeypair,
//   isValidSerializedKeypair,
//   type SerializedKeyPair
// } from '@nodenogg.in/microcosm/crypto'

type IdentityState = Identity | undefined

const createIdentity = async (): Promise<IdentityState> => identity.create()

export const createIdentitySession = (): IdentitySession => {
  const store = state<IdentityState>(undefined)

  persist(
    store,
    storage<IdentityState>({
      name: getPersistenceName(['identity']),
      validate: identity.schema.validate,
      fallback: identity.create
    })
  )

  // const keypairStorage = storage({
  //   name: getPersistenceName(['identity', 'keypair']),
  //   validate: isValidSerializedKeypair,
  //   fallback: async (): Promise<SerializedKeyPair> => {
  //     const keys = await createKeypair()
  //     return await exportKeyPair(keys)
  //   }
  // })

  // keypairStorage.get()

  // const getKeypair = async (): Promise<CryptoKeyPair | undefined> => {
  //   try {
  //     const serialized = await keypairStorage.get()
  //     return await importKeypair(serialized)
  //   } catch (error) {
  //     return undefined
  //   }
  // }

  return extend(store, {
    // getKeypair
  })
}

export type IdentitySession = State<IdentityState> & {
  // getKeypair: () => Promise<CryptoKeyPair | undefined>
}
