import { Emitter } from '../utils/emitter/Emitter'
import { SyncedMicrocosm, type ProviderFactory } from './SyncedMicrocosm'
import { createWebRTCProvider } from './webrtc'

export interface RegisterMicrocosm {
  microcosm_uri: string
  password?: string
  provider?: ProviderFactory
}

const defaultProvider = createWebRTCProvider()

export class SyncedMicrocosmManager extends Emitter<{ newMicrocosm: string }> {
  private microcosms: Map<string, SyncedMicrocosm> = new Map()
  private readonly user_id: string

  constructor(user_id: string) {
    super()
    this.user_id = user_id
  }

  public register = ({
    microcosm_uri,
    password,
    provider = defaultProvider
  }: RegisterMicrocosm) => {
    const existing = this.microcosms.get(microcosm_uri)
    if (existing) {
      return existing
    }

    console.log(`${this.microcosms.size} microcosms active`)
    if (this.microcosms.size > 5) {
      console.warn(`Performance warning: ${this.microcosms.size} active microcosms`)
    }

    const newMicrocosm = new SyncedMicrocosm({
      user_id: this.user_id,
      microcosm_uri,
      provider,
      password
    })

    this.microcosms.set(microcosm_uri, newMicrocosm)
    return newMicrocosm
  }
}
