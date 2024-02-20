import { type MicrocosmAPIFactory, MicrocosmManager } from './MicrocosmManager'
import type { MicrocosmAPI } from './api'

type InstanceSettings = {
  user_id: string
  factory: MicrocosmAPIFactory
}

export namespace Manager {
  let manager!: MicrocosmManager
  const data: Partial<InstanceSettings> = {}

  export const init = <T extends MicrocosmAPI>(
    user_id: string,
    factory: MicrocosmAPIFactory<T>
  ): MicrocosmManager<T> => {
    if (manager) {
      return manager as MicrocosmManager<T>
    }
    data.factory = factory
    data.user_id = user_id
    manager = new MicrocosmManager<T>(user_id, factory)
    return manager as MicrocosmManager<T>
  }

  export const get = () => {
    try {
      return manager
    } catch {
      throw new Error('MicrocosmManager not initialized. Did you remember to call Instance.init()?')
    }
  }

  if (import.meta.hot) {
    import.meta.hot.accept((mod) => {
      if (mod) {
        manager = new MicrocosmManager(data.user_id, data.factory)
      }
    })
  }
}
