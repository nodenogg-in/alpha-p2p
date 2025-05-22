import { storage } from '@figureland/kit/state/local-storage'
import { state, persist, extend, type State } from '@figureland/kit/state'
import { IdentitySchema, type Identity } from '@nodenogg.in/schema'

import { getPersistenceName } from '../app/App'

// import {
//   createKeypair,
//   exportKeyPair,
//   importKeypair,
//   isValidSerializedKeypair,
//   type SerializedKeyPair
// } from '@nodenogg.in/microcosm/crypto'

type IdentityState = Identity | undefined

// const createIdentity = async (): Promise<IdentityState> => identity.create()

export const createIdentitySession = (): IdentitySession => {
  const store = state<IdentityState>(undefined)

  persist(
    store,
    storage<IdentityState>({
      name: getPersistenceName(['identity']),
      validate: IdentitySchema.schema.validate,
      fallback: IdentitySchema.api.create
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
