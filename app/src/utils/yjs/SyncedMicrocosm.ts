import { Doc, UndoManager, Map as YMap } from 'yjs'
import { IndexedDBPersistence } from './IndexedDBPersistence'

import type { NodeContent } from '@/types/schema'
import { createUuid } from '..'
import { Emitter } from './Emitter'
import { WebrtcProvider } from 'y-webrtc'
import { optional, type Input, string, object, is } from 'valibot'

type Persistence = IndexedDBPersistence

type ISyncedMicrocosm = Pick<SyncedMicrocosm, 'microcosm_id' | 'user_id'> &
  Partial<Pick<SyncedMicrocosm, 'password' | 'signaling' | 'iceServers'>>

enum EventNames {
  User = 'user',
  Ready = 'ready'
}

const defaultSignaling = ['wss://nodenoggin-y-webrtc-eu.fly.dev/']
const defaultIceServers = [
  {
    urls: 'stun.l.google.com:19302'
  }
]

const userSchema = object({
  user_id: string(),
  username: optional(string())
})

export type User = Input<typeof userSchema>

type SyncedMicrocosmEvents = {
  ready: boolean
  user: User
}

export class SyncedMicrocosm extends Emitter<SyncedMicrocosmEvents> {
  public doc: Doc = new Doc()
  public microcosm_id: string
  public user_id: string
  public password?: string
  private persistence: Persistence
  private undoManager!: UndoManager
  private provider!: WebrtcProvider
  signaling: string[]
  iceServers: { urls: string }[]
  localNodes: YMap<any>
  localSubNodes: YMap<NodeContent>

  constructor({
    microcosm_id,
    user_id,
    password,
    signaling = defaultSignaling,
    iceServers = defaultIceServers
  }: ISyncedMicrocosm) {
    super()
    this.microcosm_id = microcosm_id
    this.user_id = user_id
    this.password = password

    this.signaling = signaling
    this.iceServers = iceServers

    this.persistence = new IndexedDBPersistence(this.microcosm_id, this.doc)
    this.localNodes = this.doc.getMap(user_id)

    this.localSubNodes = new YMap<NodeContent>()
    this.localNodes.set(`${user_id}-nodes`, this.localSubNodes)

    this.undoManager = new UndoManager(this.localNodes)
    this.persistence.on('synced', this.onReady)
  }

  createProvider = () => {
    const { password, iceServers, signaling } = this
    this.provider = new WebrtcProvider(this.microcosm_id, this.doc, {
      password,
      signaling,
      peerOpts: {
        iceServers
      }
    })

    this.provider.awareness.on('change', () => {
      this.provider.awareness.getStates().forEach((state) => {
        if (state.user && is(userSchema, state.user)) {
          this.emit(EventNames.User, state.user)
        }
      })
    })
    this.provider.awareness.on('update', () => {
      this.provider.awareness.getStates().forEach((state) => {
        if (state.user && is(userSchema, state.user)) {
          this.emit(EventNames.User, state.user)
        }
      })
    })
  }
  dispose = () => {
    this.doc.destroy()
    this.persistence.destroy()
  }

  clear = () => {
    this.persistence.clearData()
  }

  getNodesList = (key: string) => this.localNodes.get(key)

  public addNode = (n: NodeContent) => {
    this.doc.transact(() => {
      this.localNodes.set(createUuid(), n)
      this.localSubNodes.set(createUuid(), n)
    })
  }

  private onReady = () => {
    this.createProvider()
    this.emit(EventNames.Ready, true)
  }

  public join = (): void => {
    this.provider.awareness.setLocalStateField(EventNames.User, { user_id: this.user_id })
  }

  public leave = () => {
    this.provider.awareness.setLocalState(null)
  }

  public undo = () => {
    this.undoManager.undo()
  }
  public redo = () => {
    this.undoManager.redo()
  }
}
