import { type ActionSender, type Room, type BaseRoomConfig, joinRoom } from 'trystero'
import Emitter from 'emittery'
import { createURI } from '..'
import { is } from 'valibot'
import { actionSchema, type Action } from '@/types/actions'

export type SyncReadyState = boolean
export type SyncAction = [string, Action, string]
export type WebRTCStrategy = (config: BaseRoomConfig, roomId: string) => Room

const DEMO_SECRET = 'nodenoggin-secret' as const

export class WebRTCSync {
  public room!: Room
  private actionSender!: ActionSender<unknown>
  private peers: string[] = []
  private strategy: WebRTCStrategy
  private emitter = new Emitter()
  public uri!: string
  private state: SyncReadyState = false

  constructor(strategy: WebRTCStrategy = joinRoom) {
    this.strategy = strategy
  }

  public connect = (appId: string, microcosm_id: string) => {
    const newURI = createURI(appId, microcosm_id)
    if (this.room && this.uri === newURI) {
      return
    }
    if (this.room) {
      this.ready = false
      this.leave()
    }
    this.uri = newURI
    this.room = this.strategy({ appId, password: DEMO_SECRET }, microcosm_id)

    this.room.onPeerJoin(this.onPeerJoin)
    this.room.onPeerLeave(this.onPeerLeave)

    const dataActions = this.room.makeAction('action')

    this.actionSender = dataActions[0]

    dataActions[1]((data, peerId) => {
      if (is(actionSchema, data)) {
        this.emitter.emit('action', [this.uri, data, peerId] as SyncAction)
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
    this.emitter.clearListeners()
    this.peers = []
    this.room?.leave()
  }

  private onPeerJoin = (peerId: string) => {
    if (!this.peers.includes(peerId)) {
      this.peers.push(peerId)
    }
    this.emitter.emit('peers', this.peers)
  }

  private onPeerLeave = (peerId: string) => {
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
