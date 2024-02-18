import { Awareness } from 'y-protocols/awareness'
import { YMicrocosmDoc } from '../YMicrocosmDoc'

export interface Provider {
  awareness: Awareness
  destroy: () => void
  disconnect: () => void
  connect: () => void
  shouldConnect: boolean
}

export type ProviderFactory<T extends Provider = Provider> = (
  microcosm_id: string,
  doc: YMicrocosmDoc,
  password?: string
) => Promise<T>

export * from './webrtc/create'
