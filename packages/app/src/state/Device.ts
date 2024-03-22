import { boolean, is, number, object } from 'valibot'
import { State } from '@nodenogg.in/state'
import { isChrome, isMobile, isSafari } from '@nodenogg.in/utils'
import {
  defaultPersistence,
  type PersistenceStatus,
  getPersistenceStatus
} from '../utils/persistence'
import { Instance } from './Instance'

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
        persistence: defaultPersistence(),
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

    this.use(() => {
      window.removeEventListener('offline', this.setOffline)
      window.removeEventListener('online', this.setOnline)
    })
  }
  private setOnline = () => this.key('online').set(true)
  private setOffline = () => this.key('online').set(true)
}
