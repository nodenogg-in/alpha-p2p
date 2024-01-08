import { type ActionSender, type Room, type BaseRoomConfig, joinRoom } from 'trystero'
import Emitter from 'emittery'
import { is } from 'valibot'
import PQueue from 'p-queue'

import { actionSchema, type Action } from '@/types/actions'
import { createURI } from '..'

export type SyncReadyState = boolean
type URI = string
type PeerId = string
export type SyncAction = [URI, Action, PeerId]
export type WebRTCStrategy = (config: BaseRoomConfig, roomId: string) => Room

const DEMO_SECRET = 'nodenoggin-secret' as const

export class WebRTCSync {
  public room!: Room
  public uri!: URI

  private actionSender!: ActionSender<unknown>
  private peers: PeerId[] = []
  private strategy: WebRTCStrategy
  private emitter = new Emitter()
  private state: SyncReadyState = false
  private queue = new PQueue({ concurrency: 1 })

  constructor(strategy: WebRTCStrategy = joinRoom) {
    this.strategy = strategy
  }

  public connect = (appId: string, microcosm_id: string, force?: boolean) => {
    const newURI = createURI(appId, microcosm_id)
    if (this.room && this.uri === newURI && !force) {
      return
    }
    this.ready = false
    if (this.room) {
      this.leave()
    }

    if (newURI !== this.uri) {
      this.resetListeners()
    }

    this.uri = newURI
    this.room = this.strategy({ appId, password: DEMO_SECRET }, microcosm_id)

    this.room.onPeerJoin(this.onPeerJoin)
    this.room.onPeerLeave(this.onPeerLeave)

    const dataActions = this.room.makeAction('action')

    this.actionSender = dataActions[0]

    dataActions[1]((data, peerId) => {
      if (is(actionSchema, data)) {
        this.queue.add(() => this.emitter.emit('action', [this.uri, data, peerId] as SyncAction))
      }
    })

    this.ready = true
  }

  private set ready(r: SyncReadyState) {
    this.state = r
    this.emitter.emit('state', this.state)
  }

  private get ready() {
    return this.state
  }

  public leave = () => {
    this.peers = []
    this.room?.leave()
  }

  public resetListeners = () => {
    this.emitter.clearListeners()
  }

  private onPeerJoin = (peerId: PeerId) => {
    if (!this.peers.includes(peerId)) {
      this.peers.push(peerId)
    }
    this.emitter.emit('peers', this.peers)
  }

  private onPeerLeave = (peerId: PeerId) => {
    this.peers.filter((id) => id !== peerId)
    this.emitter.emit('peers', this.peers)
  }

  public sendAction = (action: Action) => {
    if (this.ready) this.actionSender(action)
  }

  public onPeersChange = (fn: (data: WebRTCSync['peers']) => void) => this.emitter.on('peers', fn)

  public onStateChange = (fn: (data: SyncReadyState) => void) => {
    this.emitter.on('state', fn)
    this.emitter.emit('state', this.state)
  }

  public onAction = (fn: (data: SyncAction) => void) => this.emitter.on('action', fn)
}
