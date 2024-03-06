import { isValidMicrocosmURI } from '../../utils'
import { type ViewType } from '../../schema'
import { MicrocosmFactory, type Microcosm, MicrocosmConfig } from './Microcosm'
import { Instance } from '../../app/Instance'

export class Microcosms<M extends Microcosm = Microcosm> {
  public readonly microcosms: Map<string, M> = new Map()
  private microcosmFactory: MicrocosmFactory<M>

  constructor(factory: MicrocosmFactory<M>) {
    this.microcosmFactory = factory
  }

  public dispose = () => {
    this.microcosms.forEach((microcosm) => microcosm.dispose())
    this.microcosms.clear()
  }

  public getMicrocosm = (microcosm_uri: string, view?: ViewType): M | false => {
    try {
      const target = this.microcosms.get(microcosm_uri)
      if (!target) {
        throw new Error()
      }
      Instance.session.addReference(microcosm_uri, view)
      return target
    } catch (e) {
      return false
    }
  }

  private addMicrocosm = ({ microcosm_uri, view, password, user_id }: MicrocosmConfig) => {
    const existingReference = Instance.session.getReference(microcosm_uri)

    const config: MicrocosmConfig = existingReference
      ? {
          ...existingReference,
          user_id
        }
      : {
          microcosm_uri,
          view,
          password,
          user_id
        }

    const microcosm = this.microcosmFactory(config)
    this.microcosms.set(microcosm_uri, microcosm)
    Instance.session.addReference(microcosm_uri, view)
    if (microcosm.isEditable()) {
      microcosm.api.join(Instance.session.user.getKey('username'))
    }
    return microcosm as M
  }

  public register = (config: Omit<MicrocosmConfig, 'user_id'>): M => {
    try {
      if (!isValidMicrocosmURI(config.microcosm_uri)) {
        throw new Error(`Invalid microcosm URI: ${config.microcosm_uri}`)
      }

      const existing = this.getMicrocosm(config.microcosm_uri, config.view)

      if (existing) {
        Instance.session.setActive(existing.microcosm_uri)
        return existing as M
      }

      console.log(`${this.microcosms.size} microcosms active`)
      if (this.microcosms.size > 5) {
        console.warn(`Performance warning: ${this.microcosms.size} active microcosms`)
      }

      Instance.session.setActive(config.microcosm_uri)

      return this.addMicrocosm({
        ...config,
        user_id: Instance.session.user.getKey('user_id')
      })
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${config.microcosm_uri}`)
    }
  }
}
