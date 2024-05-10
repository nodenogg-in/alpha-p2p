import { type Identity, createIdentityID, isValidIdentityID } from '@nodenogg.in/microcosm'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { type SignalObject, signalObject, signal } from '@figureland/statekit'
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

import { type Settable, type SettableType, persist } from '@figureland/statekit'
import { isArray } from '@figureland/typekit/guards'
import { isMatrix2D, matrix2D } from '@figureland/mathkit/matrix2D'
import { isNumber } from '@figureland/typekit'

export type StorageAPI<T> = {
  get: (fallback: () => T) => Promise<T>
  set: (data: T) => Promise<void>
}

export type StorageAPIOptions<T> = {
  name: PersistenceName
  validate: ((v: unknown) => Promise<boolean>) | ((v: unknown) => v is T)
  refine?: {
    get: ((v: unknown) => Promise<T>) | ((v: unknown) => T)
    set: ((v: T) => Promise<any>) | ((v: T) => any)
  }
}

export const getStorageName = (n: string | PersistenceName) => (isArray(n) ? n.join('/') : n)

export type PersistenceName = string[]

// export const persist = <S extends Settable<any>>(s: S, storage: StorageAPI<SettableType<S>>) => {
//   storage.get(s.get).then(s.set).catch()
//   s.on((v) => storage.set(v))
//   return s
// }

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

  const isMatrix2DImp = (m: unknown) => m != null && isArray(m) && m.length === 6 && m.every(isNumber)

  const m = matrix2D(0, 0, 0, 0, NaN, NaN)
  console.log(isMatrix2DImp(m))
  console.log(isMatrix2D(m))

  const storedKeypair = signal<SerializedKeyPair>(createBlankKeypair)

  persist(
    storedKeypair,
    typedLocalStorage({
      name: getPersistenceName(['identity', 'keypair']),
      validate: isValidSerializedKeypair
    })
  )

  const getKeypair = async (): Promise<CryptoKeyPair> => {
    try {
      const keys = await importKeypair(storedKeypair.get())
      return keys
    } catch {
      const keys = await createKeypair()
      storedKeypair.set(await exportKeyPair(keys))
      return keys
    }
  }

  storedKeypair.on(getKeypair)

  return {
    ...state,
    getKeypair
  }
}

export type IdentitySession = SignalObject<Identity> & {
  getKeypair: () => Promise<CryptoKeyPair>
}
