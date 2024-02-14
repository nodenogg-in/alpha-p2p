import { Doc, UndoManager, Map as YMap } from 'yjs'
import { boolean, intersect, is, object, type Input, partial, parse } from 'valibot'
import type { Awareness } from 'y-protocols/awareness'

import { identitySchema, type Node, type HTMLNode, htmlNodeSchema } from './schema'
import { type Box, type Point, type BoxReference, select } from '../canvas'
import { IndexedDBPersistence } from './persistence/IndexedDBPersistence'
import { Emitter, type Unsubscribe } from '../utils/emitter/Emitter'
import { createUuid } from '../utils/uuid'
import { objectEntries } from '../utils/misc'

// import { YKeyValue } from 'y-utility/y-keyvalue'

export const createYMap = <T extends object>(n: T) => {
  const map = new YMap<T>()
  objectEntries(n).forEach(([k, v]) => {
    map.set(k, v)
  })
  return map
}

export const updateYMap = <T extends object>(map: YMap<T>, update: Partial<T>) => {
  objectEntries(update).forEach(([k, v]) => {
    map.set(k as any, v as any)
  })
}

type Persistence = IndexedDBPersistence

type IMicrocosm = {
  microcosm_uri: string
  user_id: string
  password?: string
  provider?: ProviderFactory
}

export type ProviderFactory = (
  microcosm_id: string,
  doc: Doc,
  password?: string
) => Promise<Provider>

export interface Provider {
  awareness: Awareness
  destroy: () => void
  disconnect: () => void
  connect: () => void
  shouldConnect: boolean
}

enum EventNames {
  Nodes = 'nodes',
  NodeLists = 'nodeLists',
  Identity = 'identities',
  Ready = 'ready',
  Connected = 'connected'
}

type MicrocosmEvents = {
  nodeLists: string[]
  nodes: BoxReference<Node>[]
  ready: boolean
  connected: boolean
  identities: IdentityWithStatus[]
}

export const identityStatusSchema = intersect([
  identitySchema,
  object({
    joined: boolean()
  })
])

export type IdentityWithStatus = Input<typeof identityStatusSchema>

// Individual node as represented in Y state
export interface YHTMLNode extends YMap<HTMLNode> {
  toJSON: () => HTMLNode
}

export type YNode = YHTMLNode

// A user's collection of nodes in Y state
export type YNodeCollection = YMap<YNode>

export class Microcosm extends Emitter<MicrocosmEvents> {
  public allNodes: BoxReference<Node>[] = []
  public readonly doc: Doc
  public readonly microcosm_uri: string
  public readonly user_id: string
  public readonly password?: string
  private persistence!: Persistence
  private undoManager!: UndoManager
  private provider!: Provider
  private makeProvider!: ProviderFactory
  private nodes: YNodeCollection
  private nodeLists: YMap<boolean>

  /**
   * Creates a new microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor({ microcosm_uri, user_id, password, provider }: IMicrocosm) {
    super()

    this.microcosm_uri = microcosm_uri
    this.user_id = user_id
    this.password = password

    this.doc = new Doc()

    if (provider) {
      this.makeProvider = provider
      this.createPersistence()
    }

    this.nodes = this.doc.getMap<YNode>(this.user_id)

    this.nodeLists = this.doc.getMap<boolean>('nodeLists')
    this.nodeLists.set(this.user_id, true)
    this.doc.on('update', this.onDocUpdate)

    this.nodeLists.observe(this.onNodeLists)
    this.undoManager = new UndoManager(this.nodes)
  }

  private createPersistence = () => {
    this.persistence = new IndexedDBPersistence(this.microcosm_uri, this.doc)
    this.persistence.on('synced', this.onReady)
  }
  /**
   * Triggered when the {@link Microcosm} is ready
   */
  private onReady = async () => {
    if (this.makeProvider) {
      await this.createProvider(this.makeProvider)
    }

    this.onNodeLists()
    this.onDocUpdate()
    this.emit(EventNames.Ready, true)
  }

  /**
   * Triggered when the {@link Microcosm} is no longer ready
   */
  private offReady = async () => {
    this.emit(EventNames.Ready, false)
  }

  private onNodeLists = () => {
    this.emit(EventNames.NodeLists, Array.from(this.nodeLists.keys()))
  }

  private onDocUpdate = () => {
    this.allNodes = Array.from(this.nodeLists.keys())
      .map((n) =>
        Array.from(this.getNodes(n).entries()).map(
          ([id, v]: [string, YNode]) => [id, v.toJSON()] as BoxReference<Node>
        )
      )
      .flat(1)
    this.emit(EventNames.Nodes, this.allNodes)
  }

  public subscribe = (fn: (data: BoxReference<Node>[]) => void): Unsubscribe => {
    this.on(EventNames.Nodes, fn)
    this.onDocUpdate()

    return () => {
      this.off(EventNames.Nodes, fn)
    }
  }

  private createProvider = async (getProvider: ProviderFactory) => {
    try {
      this.provider = await getProvider(this.microcosm_uri, this.doc, this.password)
      this.connect()
      this.provider.awareness.on('change', this.handleAwareness)
      this.provider.awareness.on('update', this.handleAwareness)
      this.emit(EventNames.Connected, true)
    } catch (e) {
      this.emit(EventNames.Connected, false)
    }
  }

  private handleAwareness = () => {
    const identities = Array.from(this.provider.awareness.getStates())
      .map(([, state]) => state?.identity || {})
      .filter((identity) => is(identityStatusSchema, identity))

    this.emit(EventNames.Identity, identities)
  }

  /**
   * Disposes of this instance, meaning it can't be used again.
   * To reconnect, create another {@link Microcosm}
   */
  public dispose = () => {
    // Notify that the microcosm is no longer ready
    this.offReady()
    // Notify peers that the user has left the microcosm
    this.leave()
    // Disconnect the provider
    this.disconnect()
    // Destroy the provider instance
    this.provider?.destroy()
    // Destroy the Y.Doc instance
    this.doc.destroy()
    // Destroy the local persistence instance
    this.persistence?.destroy()
    // Destroy the undo/redo manager instance
    this.undoManager.destroy()
    // Remove all connected event listeners
    this.clearListeners()
  }

  /**
   * Connects this microcosm's {@link Y.Doc} instance to its {@link Provider}
   */
  public connect = () => {
    if (this.provider) {
      this.provider.shouldConnect = true
      // Connect the provider instance
      this.provider.connect()
      this.emit(EventNames.Connected, true)
    }
  }

  /**
   * Disconnects this microcosm's {@link Y.Doc} instance from its {@link Provider}
   */
  public disconnect = () => {
    this.provider.shouldConnect = false
    // Disconnect the provider instance
    this.provider?.disconnect()
    this.emit(EventNames.Connected, false)
  }

  /**
   * Erases this microcosm's locally stored content and disposes this instance
   */
  public clearPersistence = (reset?: boolean) => {
    // Delete all the locally-stored data
    this.persistence.clearData()
    if (reset) {
      this.createPersistence()
    }
  }

  /**
   * Deletes all the user's nodes.
   */
  public eraseNodes = () => {
    for (const [n] of this.nodes.entries()) {
      this.delete(n)
    }
  }

  /**
   * Creates a new {@link Node}
   */
  public create = (n: Node): string => {
    try {
      parse(htmlNodeSchema, n)
      const id = createUuid()
      this.doc.transact(() => {
        this.nodes.set(id, createYMap(n) as YNode)
      })
      return id
    } catch (e) {
      throw e || new Error(`${n} is not a valid node type`)
    }
  }

  /**
   * Updates a {@link Node}
   */
  public update = (node_id: string, update: Partial<Node>) => {
    const target = this.nodes.get(node_id)
    if (target && is(partial(htmlNodeSchema), update)) {
      if (update.type && target.toJSON()?.type !== update.type) {
        return
      }
      this.doc.transact(() => {
        updateYMap(target as YMap<Node>, update)
      })
    }
  }

  /**
   * Deletes a {@link Node}
   */
  public delete = (node_id: string) => {
    this.doc.transact(() => {
      this.nodes.delete(node_id)
    })
  }

  /**
   * Gets a list of {@link Node}s in a {@link YNodeCollection}
   */
  public getNodes = (user_id: string = this.user_id): YNodeCollection => {
    if (!user_id || user_id === this.user_id) {
      return this.nodes
    } else {
      return this.doc.getMap(user_id)
    }
  }

  public getAllNodes = (): BoxReference<Node>[] => {
    return this.allNodes
  }

  /**
   * Gets a single {@link Node} by id. Optionally, specify a user_id
   * to get a node from another user's {@link YNodeCollection}.
   */
  public getNode = (node_id: string, user_id: string = this.user_id): YNode | undefined =>
    this.getNodes(user_id).get(node_id)

  /**
   * Retrieves nodes that intersect with a given point and box
   */
  public select = (point: Point, box: Box) => select(this.allNodes, point, box)
  /**
   * Joins the microcosm, publishing identity status to connected peers
   */
  public join = (username?: string): void => {
    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: true,
      ...(username && { username })
    } as IdentityWithStatus)
  }

  /**
   * Leaves the microcosm, publishing identity status to connected peers
   */
  public leave = (username?: string) => {
    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: false,
      ...(username && { username })
    } as IdentityWithStatus)
  }

  /**
   * Undoes the previous action within this user's list of nodes in the microcosm
   */
  public undo = () => {
    this.undoManager.undo()
  }

  /**
   * Redoes the previous action within this user's list of nodes in the microcosm
   */
  public redo = () => {
    this.undoManager.redo()
  }
}
