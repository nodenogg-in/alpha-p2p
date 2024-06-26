import { is } from 'valibot'
import {
  type NodePatch,
  type NodeUpdate,
  type MicrocosmAPIConfig,
  type NewNode,
  type MicrocosmAPI,
  type IdentityWithStatus,
  type NodeType,
  type Node,
  type NodeReference,
  type NodeID,
  type IdentityID,
  EditableMicrocosmAPI,
  createNode,
  getNodesByType,
  createNodeID,
  isNodeType,
  nodeSchema,
  identityStatusSchema
} from '@nodenogg.in/microcosm'
import { signal } from '@figureland/statekit'
import { isArray } from '@figureland/typekit'

import type { Provider, ProviderFactory } from './provider'
import { IndexedDBPersistence } from './IndexedDBPersistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'
import { Telemetry } from '@nodenogg.in/framework'

export class YMicrocosmAPI extends EditableMicrocosmAPI {
  private readonly doc = new YMicrocosmDoc()
  private persistence!: IndexedDBPersistence
  private provider!: Provider
  /**
   * Creates a new Microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(
    config: MicrocosmAPIConfig,
    private readonly providerFactory?: ProviderFactory,
    protected telemetry?: Telemetry
  ) {
    super(config, telemetry)
    this.doc.init(this.identityID)

    if (this.providerFactory) {
      this.createPersistence()
    }

    this.use(() => {
      // Notify that the Microcosm is no longer ready
      this.offReady()
      // Notify peers that the user has left the Microcosm
      this.leave()
      // Disconnect the provider
      this.disconnect()
      // Destroy the provider instance
      this.provider?.destroy()
      // Dispose the YMicrocosmAPIDoc instance
      this.doc.dispose()
      // Destroy the local persistence instance
      this.persistence?.destroy()
    })
  }

  public updatePassword = async (password: string) => {
    if (password === this.password) {
      this.provider.destroy()
      await this.offReady()
      this.password = password
      await this.onReady()
    }
  }

  private createPersistence = () => {
    this.persistence = new IndexedDBPersistence(this.microcosmID, this.doc)
    this.persistence.on('synced', this.onReady)
  }
  /**
   * Triggered when the {@link MicrocosmAPI} is ready
   */
  private onReady = async () => {
    this.createProvider().catch(this.telemetry?.catch)
    const signal = this.doc.subscribeToCollections()
    this.key('collections').set(signal.get())
    signal.on((collections) => this.key('collections').set(collections))
    this.use(signal.dispose)
    this.key('status').set({ ready: true })
  }

  /**
   * Triggered when the {@link MicrocosmAPI} is no longer ready
   */
  private offReady = async () => {
    this.key('status').set({ ready: false })
  }

  private createProvider = async () => {
    try {
      if (!this.providerFactory) {
        throw this.telemetry?.throw({
          name: 'YMicrocosmAPI',
          message: `Could not sync YMicrocosmAPI: no provider specified`,
          level: 'info'
        })
      }
      if (!this.provider) {
        this.provider = await this.providerFactory(this.microcosmID, this.doc, this.password)
        const timer = this.telemetry?.time({
          name: 'YMicrocosmAPI',
          message: `Connected ${this.microcosmID} @ ${this.provider.signalingUrls.join('')}`,
          level: 'info'
        })
        this.connect()
        timer?.finish()

        this.provider.awareness.on('change', this.handleAwareness)
        this.provider.awareness.on('update', this.handleAwareness)
      }
      this.key('status').set({ connected: true })
    } catch (error) {
      this.key('status').set({ connected: false })
      throw this.telemetry?.catch(error)
    }
  }

  private handleAwareness = () => {
    this.key('identities').set(
      Array.from(this.provider.awareness.getStates())
        .map(([, state]) => state?.identity || {})
        .filter((identity) => is(identityStatusSchema, identity))
    )
  }

  /**
   * Connects this Microcosm's {@link Y.Doc} instance to its {@link Provider}
   */
  private connect = () => {
    if (this.provider) {
      this.provider.shouldConnect = true
      // Connect the provider instance
      this.provider.connect()
      this.key('status').set({ connected: true })
    }
  }

  /**
   * Disconnects this Microcosm's {@link Y.Doc} instance from its {@link Provider}
   */
  private disconnect = () => {
    this.provider.shouldConnect = false
    // Disconnect the provider instance
    this.provider?.disconnect()
    this.key('status').set({ connected: false })
  }

  /**
   * Erases this Microcosm's locally stored content and disposes this instance
   */
  public clearPersistence = (reset?: boolean) => {
    // Delete all the locally-stored data
    this.persistence.clearData()
    if (reset) {
      this.createPersistence()
    }
  }

  /**
   * Creates a new {@link Node}
   */
  private createNode = async (newNode: NewNode) => {
    try {
      const node = await createNode(newNode)
      if (is(nodeSchema, node)) {
        const id = createNodeID()
        this.doc.collection.set(id, node)
        return id
      } else {
        throw this.telemetry?.throw({
          name: 'createNode',
          message: `Invalid node: ${JSON.stringify(newNode)}`,
          level: 'warn'
        })
      }
    } catch (error) {
      throw this.telemetry?.catch(error)
    }
  }

  /**
   * Creates a new {@link Node}
   */
  public create: EditableMicrocosmAPI['create'] = (n) =>
    this.doc.transact(async () => {
      if (isArray(n)) {
        return await Promise.all(n.map(this.createNode))
      } else {
        return await this.createNode(n)
      }
    })

  /**
   * Updates one or more {@link Node}s
   */
  public update: EditableMicrocosmAPI['update'] = <T extends NodeType>(
    ...u: [NodeID, NodeUpdate<T>][]
  ) =>
    this.doc.transact(
      async () => await Promise.all(u.map(([nodeId, update]) => this.doc.update(nodeId, update)))
    )

  public patch: EditableMicrocosmAPI['patch'] = async <T extends NodeType>(
    nodeId: NodeID,
    patch: NodePatch<T>
  ) => {
    const target = this.doc.collection.get(nodeId)
    if (target) {
      this.doc.update(nodeId, patch(target as Node<T>))
    }
  }

  /**
   * Deletes an array of {@link Node}s
   */
  public delete: EditableMicrocosmAPI['delete'] = (nodeID: NodeID | NodeID[]) => {
    this.doc.transact(() => {
      if (isArray(nodeID)) {
        for (const n of nodeID) {
          this.doc.collection.delete(n)
        }
      } else {
        this.doc.collection.delete(nodeID)
      }
    })
  }

  /**
   * Deletes all the user's {@link Node}s.
   */
  public deleteAll = () => {
    for (const [n] of this.doc.collection.entries()) {
      this.delete(n as NodeID)
    }
  }

  public nodes: EditableMicrocosmAPI['nodes'] = (type) => getNodesByType(this.doc.nodes(), type)

  public node: EditableMicrocosmAPI['node'] = <T extends NodeType>(
    id: NodeID,
    type?: T
  ): Node<T> | undefined => {
    const target = this.doc.collection.get(id)
    if (target) {
      if (type) {
        return isNodeType(target, type) ? (target as Node<T>) : undefined
      }
      return target as Node<T>
    } else {
      return undefined
    }
  }

  public getCollections: EditableMicrocosmAPI['getCollections'] = this.doc.getCollections

  /**
   * Subscribes to a collection
   */
  public subscribeToCollection: EditableMicrocosmAPI['subscribeToCollection'] = (
    identityID: IdentityID
  ) => {
    const state = signal<NodeReference[]>(() => this.doc.collectionToNodes(identityID))
    this.use(
      state.dispose,
      this.doc.subscribeToCollection(identityID, (nodes) => {
        state.set(nodes)
      })
    )
    return state
  }

  public getCollection: EditableMicrocosmAPI['getCollection'] = this.doc.collectionToNodes

  /**
   * Joins the Microcosm, publishing identity status to connected peers
   */
  public join: EditableMicrocosmAPI['join'] = (nickname) => {
    this.telemetry?.log({
      name: 'MicrocosmAPI',
      message: `Joined ${this.microcosmID}`,
      level: 'info'
    })
    this.provider?.awareness.setLocalStateField('identity', {
      identityID: this.identityID,
      joined: true,
      nickname
    } as IdentityWithStatus)
  }
  /**
   * Leaves the Microcosm, publishing identity status to connected peers
   */
  public leave: EditableMicrocosmAPI['leave'] = (nickname) => {
    this.telemetry?.log({
      name: 'MicrocosmAPI',
      message: `Left ${this.microcosmID}`,
      level: 'info'
    })

    this.provider?.awareness.setLocalStateField('identity', {
      identityID: this.identityID,
      joined: false,
      nickname
    } as IdentityWithStatus)
  }

  /**
   * Destroys the Microcosm's content and disposes this instance
   */
  public destroy = () => {
    this.clearPersistence()
    this.dispose()
  }

  public undo: EditableMicrocosmAPI['undo'] = () => this.doc.undo()

  public redo: EditableMicrocosmAPI['redo'] = () => this.doc.redo()

  public boxes = () => this.nodes('html')
}
