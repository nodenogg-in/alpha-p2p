import { Emitter } from '../utils/emitter/Emitter'
import { createTimestamp } from '../utils'
import type { MicrocosmReference } from './schema'
import { isEditableMicrocosmAPI, type MicrocosmAPI } from './api'

export interface RegisterMicrocosm {
  microcosm_uri: string
  password?: string
}

export type MicrocosmAPIFactory<M extends MicrocosmAPI = MicrocosmAPI> = (
  args: RegisterMicrocosm & { user_id: string }
) => M

export class MicrocosmManager<M extends MicrocosmAPI> extends Emitter<{
  microcosms: Map<string, MicrocosmReference>
}> {
  private microcosms: Map<string, M> = new Map()
  private references: Map<string, MicrocosmReference> = new Map()
  private readonly user_id: string
  private factory: MicrocosmAPIFactory<M>

  constructor(user_id: string, factory: MicrocosmAPIFactory<M>) {
    super()
    this.factory = factory
    this.user_id = user_id
  }

  public register = ({ microcosm_uri, password }: RegisterMicrocosm): M => {
    const existing = this.microcosms.get(microcosm_uri)
    const ref = {
      microcosm_uri,
      lastAccessed: createTimestamp()
    }
    this.references.set(microcosm_uri, ref)
    this.emit('microcosms', this.references)

    if (existing) {
      return existing
    }

    console.log(`${this.microcosms.size} microcosms active`)
    if (this.microcosms.size > 5) {
      console.warn(`Performance warning: ${this.microcosms.size} active microcosms`)
    }

    const newMicrocosm = this.factory({
      user_id: this.user_id,
      microcosm_uri,
      password
    })

    this.microcosms.set(microcosm_uri, newMicrocosm)
    return newMicrocosm
  }

  public leave = (microcosm_uri: string) => {
    const existing = this.microcosms.get(microcosm_uri)
    if (existing) {
      if (isEditableMicrocosmAPI(existing)) {
        existing.leave()
      }
      existing.dispose()
      this.microcosms.delete(microcosm_uri)
      this.references.delete(microcosm_uri)
      this.emit('microcosms', this.references)
    }
  }
}
