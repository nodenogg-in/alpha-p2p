import { array, boolean, object, partial, string, type Input } from 'valibot'

const algorithm: RsaHashedKeyGenParams = {
  name: 'RSASSA-PKCS1-v1_5',
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-256'
} as const

const KEY_EXPORT_TYPE = 'jwk' as const
const KEY_USAGES = ['sign', 'verify'] as const

const EXTRACTABLE = true as const

const generateKeyPair = async (): Promise<CryptoKeyPair> =>
  crypto.subtle.generateKey(algorithm, EXTRACTABLE, KEY_USAGES)

export const exportJWTKeyPair = async () => {
  const keyPair = await generateKeyPair()
  return {
    privateKey: await exportKey(keyPair.privateKey),
    publicKey: await exportKey(keyPair.publicKey)
  }
}
export const importJWTKeyPair = async (keyData: JWTKeyPair) => ({
  privateKey: await importKey(keyData.privateKey, ['sign']),
  publicKey: await importKey(keyData.publicKey, ['verify'])
})

const exportKey = async (key: CryptoKey) => crypto.subtle.exportKey(KEY_EXPORT_TYPE, key)

const importKey = async (keyData: JsonWebKey, key_ops: KeyUsage[]) =>
  crypto.subtle.importKey(KEY_EXPORT_TYPE, keyData, algorithm, EXTRACTABLE, key_ops)

// Function to convert a string to a Uint8Array
const strToUint = (str: string): Uint8Array => {
  return new TextEncoder().encode(str)
}

// Function to convert Uint8Array to base64 string
const uintToBase64 = (uint: Uint8Array): string => {
  return btoa(String.fromCharCode.apply(null, Array.from(uint)))
}

// Signs a payload with a private key
export const signData = async (privateKey: CryptoKey, data: object | string): Promise<string> => {
  const encoded = strToUint(JSON.stringify(data))
  const signature = await crypto.subtle.sign(algorithm, privateKey, encoded)
  return uintToBase64(new Uint8Array(signature))
}

// Verifies a signature using a public key
export const verifySignature = async (
  publicKey: CryptoKey,
  signature: string,
  data: object | string
): Promise<boolean> => {
  const encoded = strToUint(JSON.stringify(data))
  const signatureArray = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0))
  return crypto.subtle.verify(algorithm, publicKey, signatureArray, encoded)
}

const privateJWTKeySchema = partial(
  object({
    alg: string(),
    d: string(),
    dp: string(),
    dq: string(),
    e: string(),
    ext: boolean(),
    key_ops: array(string()),
    kty: string(),
    n: string(),
    p: string(),
    q: string(),
    qi: string()
  })
)

const publicJWTKeySchema = partial(
  object({
    alg: string(),
    e: string(),
    ext: boolean(),
    key_ops: array(string()),
    kty: string(),
    n: string()
  })
)

const JWTKeyPairSchema = object({
  privateKey: privateJWTKeySchema,
  publicKey: publicJWTKeySchema
})

type JWTKeyPair = Input<typeof JWTKeyPairSchema>
