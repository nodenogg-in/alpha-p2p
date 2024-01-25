import { Emitter } from '../../utils/emitter/Emitter'
import { SyncedMicrocosm } from './SyncedMicrocosm'
import { createWebRTCProvider } from './webrtc'

export class SyncedMicrocosmManager extends Emitter<{ newMicrocosm: string }> {
  private microcosms: Map<string, SyncedMicrocosm> = new Map()
  private user_id: string

  constructor(user_id: string) {
    super()
    this.user_id = user_id
  }

  public register = (microcosm_uri: string) => {
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
      provider: createWebRTCProvider()
    })

    this.microcosms.set(microcosm_uri, newMicrocosm)
    return newMicrocosm
  }
}
