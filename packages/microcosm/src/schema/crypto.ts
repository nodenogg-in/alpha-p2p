import { isObject, isString } from '@figureland/kit/ts/guards'
import type { Entity } from './entity.schema'
import { isEntity } from '../guards/entity-guards'

const { stringify } = JSON

const KEY_NAME = 'RSASSA-PKCS1-v1_5' as const
const KEY_HASH = { name: 'SHA-256' } as const
const KEY_MODULUS = 2048 as const
const KEY_USAGES = ['sign', 'verify'] as const

export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey(
    key.type === 'public' ? 'spki' : 'pkcs8',
    key
  )
  return btoa(String.fromCharCode(...new Uint8Array(exported)))
}

export const importKey = async (
  base64: string,
  keyType: 'public' | 'private'
): Promise<CryptoKey> => {
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return await window.crypto.subtle.importKey(
    keyType === 'public' ? 'spki' : 'pkcs8',
    binary,
    {
      name: KEY_NAME,
      hash: KEY_HASH
    },
    true,
    keyType === 'public' ? ['verify'] : ['sign']
  )
}

export type SerializedKeyPair = {
  publicKey: string
  privateKey: string
}

export const importKeypair = async (u: SerializedKeyPair) => ({
  publicKey: await importKey(u.publicKey, 'public'),
  privateKey: await importKey(u.privateKey, 'private')
})

export const isSerializedKeypair = (u: unknown): u is SerializedKeyPair =>
  isObject(u) &&
  'publicKey' in u &&
  isString(u.publicKey) &&
  'privateKey' in u &&
  isString(u.privateKey)

export const isValidSerializedKeypair = async (u: unknown): Promise<boolean> => {
  try {
    if (isSerializedKeypair(u)) {
      await importKeypair(u)
      return true
    } else {
      throw new Error(`Invalid serialized key pair`)
    }
  } catch {
    return false
  }
}

export const exportKeyPair = async (u: CryptoKeyPair) => ({
  publicKey: await exportKey(u.publicKey),
  privateKey: await exportKey(u.privateKey)
})

export const createKeypair = async (): Promise<CryptoKeyPair> =>
  globalThis.crypto.subtle.generateKey(
    {
      name: KEY_NAME,
      modulusLength: KEY_MODULUS,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: KEY_HASH
    },
    true,
    KEY_USAGES
  )

export type Signed<T> = {
  data: T
  signature: string
}

export type SignatureFn = <E extends Entity>(entity: E, privateKey: CryptoKey) => Promise<Signed<E>>

export const sign: SignatureFn = async (entity, privateKey) => {
  const data = new TextEncoder().encode(stringify(entity))
  const signature = await window.crypto.subtle.sign(KEY_NAME, privateKey, data)
  return {
    signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
    data: entity
  }
}

export type ValidationFn = <E extends Entity>(
  entity: Signed<E>,
  publicKey: CryptoKey
) => Promise<E | boolean>

export const validate: ValidationFn = async (entity, publicKey) => {
  const data = new TextEncoder().encode(stringify(entity.data))
  const binarySignature = Uint8Array.from(atob(entity.signature), (char) => char.charCodeAt(0))
  const isValid = await globalThis.crypto.subtle.verify(KEY_NAME, publicKey, binarySignature, data)
  if (!isValid || isEntity(entity.data)) {
    throw new Error(`Invalid entity: ${stringify(entity.data)}`)
  }
  return entity.data
}
