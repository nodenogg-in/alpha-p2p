import { Doc, UndoManager, Map as YMap, Array as YArray } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { object, is, literal } from 'valibot'

import { IndexedDBPersistence } from './IndexedDBPersistence'
import { Emitter } from './Emitter'
import { identitySchema, type Identity, type Node } from '@/types/schema'
import { createYMap } from './utils'

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
  ready: boolean
  connected: boolean
  identity: Identity
}

// Individual node as represented in Y state
type YNode = YMap<Node>

// A user's list of nodes in Y state
type YNodeArray = YArray<YNode>

export class SyncedMicrocosm extends Emitter<SyncedMicrocosmEvents> {
  public readonly doc: Doc = new Doc()
  public readonly microcosm_uri: string
  public readonly user_id: string
  public readonly password?: string
  private persistence: Persistence
  private undoManager!: UndoManager
  private provider!: WebrtcProvider
  private yMicrocosm: YMap<YNodeArray>
  private nodeArray: YArray<YNode>
  private server!: SyncedMicrocosmServerConfig

  constructor({ microcosm_uri, user_id, password, server }: ISyncedMicrocosm) {
    super()

    this.microcosm_uri = microcosm_uri
    this.user_id = user_id
    this.password = password

    if (server) {
      this.server = { ...server }
    }

    this.persistence = new IndexedDBPersistence(this.microcosm_uri, this.doc)
    this.yMicrocosm = this.doc.getMap('node')

    this.nodeArray = new YArray<YNode>()
    this.yMicrocosm.set(this.user_id, this.nodeArray)

    this.doc.getMap('node').observe(() => {
      console.log('hello node')
    })
    this.doc.on('update', () => {
      console.log('update')
      // console.log('update!!!')
      console.log(this.doc.getMap('node').toJSON())
      console.log(this.doc.getMap('node').entries())
      // console.log(Object.entries(this.nodes.toJSON()).length)
      // if (shared) {
      //   shared.forEach((s, k) => {
      //     console.log('===================================')
      //     console.log(k)
      //     console.log(s)
      //     console.log(s.toJSON())
      //   })
      // }
    })

    this.undoManager = new UndoManager(this.nodeArray)
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

    this.provider.awareness.on('change', () => {
      this.provider.awareness.getStates().forEach((state) => {
        if (state.identity && is(identitySchema, state.identity)) {
          this.emit(EventNames.Identity, state.identity)
        }
      })
    })
    this.provider.awareness.on('update', () => {
      this.provider.awareness.getStates().forEach((state) => {
        if (state.identity && is(identitySchema, state.identity)) {
          this.emit(EventNames.Identity, state.identity)
        }
      })
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

  public addNode = (n: Node) => {
    this.doc.transact(() => {
      this.nodeArray.push([createYMap(n)])
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
