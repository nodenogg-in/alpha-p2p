import { TelemetryError } from '..'

export type PersistenceStatus = {
  available: number
  canPersist: boolean
}

export const defaultPersistence = (): PersistenceStatus => ({
  available: 0,
  canPersist: false
})

export const getPersistenceStatus = async (): Promise<PersistenceStatus> => {
  const persistenceResult = defaultPersistence()
  try {
    if (navigator.storage) {
      if (navigator.storage.estimate) {
        const storageEstimate = await navigator.storage.estimate()
        const hasQuota = !!storageEstimate.quota && !!storageEstimate.usage

        const { usage = 0, quota = 0 } = storageEstimate
        persistenceResult.available = quota > usage && hasQuota ? quota - usage : 0
      }
      if (navigator.storage.persisted) {
        const persistent = await navigator.storage.persisted()
        if (!persistent && navigator.storage.persist) {
          persistenceResult.canPersist = await navigator.storage.persist()
        }
      }
    } else {
      throw false
    }
  } catch (error) {
    throw new TelemetryError(
      {
        name: 'getPersistence',
        message: `Could not access navigator.storage`,
        level: 'info'
      },
      error
    )
  }
  return persistenceResult
}
