import { Doc, UndoManager, Map as YMap, Array as YArray } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { object, is, literal } from 'valibot'

import { IndexedDBPersistence } from './IndexedDBPersistence'
import { Emitter } from './Emitter'
import { identitySchema, type Identity, type Node } from '@/types/schema'
import { createYMap, updateYMap } from './utils'

type Persistence = IndexedDBPersistence

type ISyncedMicrocosm = {
  microcosm_uri: string
  user_id: string
  password?: string
  server?: SyncedMicrocosmServerConfig
}

export type SyncedMicrocosmServerConfig = {
  domain: string
  secure?: boolean
  iceServers?: { urls: string }[]
}

enum EventNames {
  NodeLists = 'nodeLists',
  Identity = 'identity',
  Ready = 'ready',
  Connected = 'connected'
}

const defaultIceServers = [
  {
    urls: 'stun.l.google.com:19302'
  }
]

type SyncedMicrocosmEvents = {
  nodeLists: string[]
  ready: boolean
  connected: boolean
  identity: Identity
}

// Individual node as represented in Y state
export type YNode = YMap<Node>

// A user's list of nodes in Y state
export type YNodeArray = YArray<YNode>

export class SyncedMicrocosm extends Emitter<SyncedMicrocosmEvents> {
  public readonly doc: Doc
  public readonly microcosm_uri: string
  public readonly user_id: string
  public readonly password?: string
  private persistence: Persistence
  private undoManager!: UndoManager
  private provider!: WebrtcProvider
  private nodes: YArray<YNode>
  private nodeLists: YMap<boolean>
  private server!: SyncedMicrocosmServerConfig

  constructor({ microcosm_uri, user_id, password, server }: ISyncedMicrocosm) {
    super()

    this.microcosm_uri = microcosm_uri
    this.user_id = user_id
    this.password = password

    if (server) {
      this.server = { ...server }
    }

    this.doc = new Doc()
    this.persistence = new IndexedDBPersistence(this.microcosm_uri, this.doc)
    this.nodes = this.doc.getArray(this.user_id)

    this.nodeLists = this.doc.getMap<boolean>('nodeLists')
    this.nodeLists.set(this.user_id, true)

    this.nodeLists.observe(() => {
      this.emit(EventNames.NodeLists, Array.from(this.nodeLists.keys()))
    })

    this.undoManager = new UndoManager(this.nodes)
    this.persistence.on('synced', this.onReady)
  }

  private onReady = async () => {
    const connected = await this.testConnection()
    this.emit(EventNames.Connected, connected)

    if (connected) {
      this.createProvider()
    }

    this.emit(EventNames.Ready, true)
  }

  private testConnection = async (): Promise<boolean> => {
    try {
      if (!this.server) {
        return false
      }

      const { secure, domain } = this.server
      const http = `http${secure ? 's' : ''}://${domain}`

      const test = await fetch(http)
      const response = await test.json()

      return is(object({ status: literal('ok') }), response)
    } catch {
      return false
    }
  }

  private createProvider = () => {
    if (!this.server) {
      this.emit(EventNames.Connected, false)
      return
    }

    const { password } = this
    const { secure, domain, iceServers = defaultIceServers } = this.server
    const signaling = [`ws${secure ? 's' : ''}://${domain}`]

    this.provider = new WebrtcProvider(this.microcosm_uri, this.doc, {
      password,
      signaling,
      peerOpts: {
        iceServers
      }
    })

    this.provider.awareness.on('change', this.handleAwenress)
    this.provider.awareness.on('update', this.handleAwenress)
  }

  handleAwenress = () => {
    this.provider.awareness.getStates().forEach((state) => {
      if (state.identity && is(identitySchema, state.identity)) {
        this.emit(EventNames.Identity, state.identity)
      }
    })
  }

  dispose = () => {
    this.clearListeners()
    this.doc.destroy()
    this.persistence.destroy()
  }

  clear = () => {
    this.persistence.clearData()
  }

  public create = (n: Node) => {
    this.doc.transact(() => {
      this.nodes.push([createYMap(n)])
    })
  }

  public update = (index: number, update: Partial<Node>) => {
    const target = this.nodes.get(index)
    if (target) {
      this.doc.transact(() => {
        updateYMap(target, update)
      })
    }
  }

  public getNodes = (user_id: string = this.user_id): YNodeArray => {
    if (!user_id || user_id === this.user_id) {
      return this.nodes
    } else {
      return this.doc.getArray(user_id)
    }
  }
  public delete = (index: number) => {
    this.doc.transact(() => {
      this.nodes.delete(index, 1)
    })
  }

  public join = (username?: string): void => {
    this.provider?.awareness.setLocalStateField(EventNames.Identity, {
      user_id: this.user_id,
      ...(username && { username })
    })
  }

  public leave = () => {
    this.provider?.awareness.setLocalState(null)
  }

  public undo = () => {
    this.undoManager.undo()
  }
  public redo = () => {
    this.undoManager.redo()
  }
}
