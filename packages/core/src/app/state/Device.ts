import { boolean, is, number, object } from 'valibot'
import { State } from '@nodenogg.in/state'
import { isChrome, isMobile, isSafari } from '@nodenogg.in/utils'
import { DEFAULT_PERSISTENCE, type PersistenceStatus, getPersistenceStatus } from '../persistence'
import { Instance } from '..'

export type DeviceState = {
  online: boolean
  persistence: PersistenceStatus
  safari: boolean
  chrome: boolean
  mobile: boolean
}

export class Device extends State<DeviceState> {
  constructor() {
    super({
      initial: () => ({
        online: navigator?.onLine || true,
        persistence: DEFAULT_PERSISTENCE,
        safari: isSafari(),
        chrome: isChrome(),
        mobile: isMobile()
      }),
      persist: {
        name: Instance.getPersistenceName(['device']),
        validate: (v) =>
          is(
            object({
              online: boolean(),
              persistence: object({
                available: number(),
                canPersist: boolean()
              }),
              safari: boolean(),
              chrome: boolean(),
              mobile: boolean()
            }),
            v
          )
      }
    })

    getPersistenceStatus().then((persistence) => this.set({ persistence }))
    window.addEventListener('offline', this.setOffline)
    window.addEventListener('online', this.setOnline)

    this.onDispose(() => {
      window.removeEventListener('offline', this.setOffline)
      window.removeEventListener('online', this.setOnline)
    })
  }
  private setOnline = () => this.setKey('online', true)
  private setOffline = () => this.setKey('online', true)
}
