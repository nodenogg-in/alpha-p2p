// import { getLocalStorage } from './utils/hooks/use-local-storage'

export const KEY_STORAGE_NAME = 'keys'

// // This helper creates a signing/verifying key pair with
// // a unique user name and persists it to local storage.
// export const getLocalIdentity = async (): Promise<CryptoKeyPair> => {
//   const keyJWTTokens = getLocalStorage(KEY_STORAGE_NAME, JWTKeyPairSchema, await exportJWTKeyPair())
//   const keys = await importJWTKeyPair(keyJWTTokens)
//   return keys
// }

// // This helper validates a JWT key/pair. This can be used
// // to export and import identity settings between clients.
// export const setLocalIdentity = async (jwt: JWTKeyPair) => {
//   try {
//     if (!is(JWTKeyPairSchema, jwt)) {
//       throw new Error()
//     }
//     await importJWTKeyPair(jwt)
//     setLocalStorage(KEY_STORAGE_NAME, jwt)
//   } catch {
//     throw new Error('Could not validate JWT key')
//   }
// }
