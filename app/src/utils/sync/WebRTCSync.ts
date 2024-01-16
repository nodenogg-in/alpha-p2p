import { type ActionSender, type Room, joinRoom } from 'trystero'
import Emitter from 'emittery'
import { is } from 'valibot'
import PQueue from 'p-queue'

import { nodeActionSchema, type Action } from '@/types/actions'

export type SyncReadyState = boolean
type URI = string
type PeerId = string
export type SyncNodeAction = [URI, Action, PeerId]
export type WebRTCStrategy = (...a: any) => Room

const DEFAULT_PASSWORD = 'nodenoggin-secret' as const

const DEFAULT_TRYSTERO_APP_NAME = 'nodenoggin'

const ACTION_EVENT_NAME = 'action' as const
const STATE_EVENT_NAME = 'state' as const
const PEER_EVENT_NAME = 'peer' as const

const CONCURRENCY = 1 as const

interface WebRTCSyncConnect {
  strategy?: WebRTCStrategy
  uri: string
  appId?: string
  password?: string
  force?: boolean
}

export class WebRTCSync {
  public room!: Room
  public uri!: URI

  private actionSender!: ActionSender<unknown>
  private strategy!: WebRTCStrategy
  private emitter = new Emitter()
  private state: SyncReadyState = false
  private nodeQueue = new PQueue({ concurrency: CONCURRENCY })

  constructor({
    appId = DEFAULT_TRYSTERO_APP_NAME,
    strategy = joinRoom,
    password = DEFAULT_PASSWORD,
    uri,
    force
  }: WebRTCSyncConnect) {
    try {
      this.strategy = strategy
      if (this.room && this.uri === uri && !force) {
        return
      }
      this.ready = false

      if (this.room) {
        this.leave()
      }

      if (uri !== this.uri) {
        this.resetListeners()
      }

      this.uri = uri
      console.log({ appId, password }, uri)
      this.room = this.strategy({ appId, password }, uri)

      const actions = this.room.makeAction(ACTION_EVENT_NAME)

      this.room.onPeerJoin((peerId) => {
        this.emitter.emit(PEER_EVENT_NAME, peerId)
      })

      this.actionSender = actions[0]

      actions[1]((data, peerId) => {
        if (is(nodeActionSchema, data)) {
          this.nodeQueue.add(() =>
            this.emitter.emit(ACTION_EVENT_NAME, [this.uri, data, peerId] as SyncNodeAction)
          )
        }
      })

      this.ready = true
    } catch (e) {
      console.log(e)
    }
  }

  private set ready(r: SyncReadyState) {
    this.state = r
    this.emitter.emit(STATE_EVENT_NAME, this.state)
  }

  private get ready() {
    return this.state
  }

  public leave = () => {
    this.room?.leave()
  }

  public resetListeners = () => {
    this.emitter.clearListeners()
  }

  // Actions

  public sendAction = (action: Action) => {
    if (this.ready) this.actionSender(action)
  }

  public onAction = (fn: (data: SyncNodeAction) => void) => this.emitter.on(ACTION_EVENT_NAME, fn)

  // State

  public onStateChange = (fn: (data: SyncReadyState) => void) => {
    this.emitter.on(STATE_EVENT_NAME, fn)
    this.emitter.emit(STATE_EVENT_NAME, this.state)
  }

  // Peers

  public onPeerChange = (fn: (peerId: string) => void) => {
    this.emitter.on(PEER_EVENT_NAME, fn)
  }
}
