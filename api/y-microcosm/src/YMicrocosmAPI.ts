import { is } from 'valibot'
import {
  type NodePatch,
  type NodeUpdate,
  createNode,
  getNodesByType,
  Instance,
  createUuid,
  MicrocosmAPI,
  EditableMicrocosmAPI,
  BaseMicrocosmAPI,
  MicrocosmAPIConfig
} from '@nodenogg.in/core'
import {
  type IdentityWithStatus,
  type NodeType,
  type Node,
  type NewNode,
  type NodeReference,
  isNodeType,
  nodeSchema,
  identityStatusSchema
} from '@nodenogg.in/schema'
import { State, signal } from '@nodenogg.in/state'
import { isArray } from '@nodenogg.in/utils'

import type { Provider, ProviderFactory } from './provider'
import { IndexedDBPersistence } from './IndexedDBPersistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'

export class YMicrocosmAPI extends BaseMicrocosmAPI implements EditableMicrocosmAPI {
  private readonly doc = new YMicrocosmDoc()
  private persistence!: IndexedDBPersistence
  private provider!: Provider
  /**
   * Creates a new Microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(
    config: MicrocosmAPIConfig,
    private readonly providerFactory?: ProviderFactory
  ) {
    super(config)
    this.doc.init(this.user_id)

    if (this.providerFactory) {
      this.createPersistence()
    }

    this.onDispose(() => {
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
    await this.offReady()
    this.password = password
    await this.onReady()
  }

  private createPersistence = () => {
    this.persistence = new IndexedDBPersistence(this.microcosm_uri, this.doc)
    this.persistence.on('synced', this.onReady)
  }
  /**
   * Triggered when the {@link MicrocosmAPI} is ready
   */
  private onReady = async () => {
    this.createProvider().catch(Instance.telemetry.catch)
    this.onDispose(
      this.doc.subscribeToCollections((collections) => {
        this.key('collections').set(collections)
      })
    )
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
        throw Instance.telemetry.throw({
          name: 'YMicrocosmAPI',
          message: `Could not sync YMicrocosmAPI: no provider specified`,
          level: 'info'
        })
      }
      if (!this.provider) {
        this.provider = await this.providerFactory(this.microcosm_uri, this.doc, this.password)
        const timer = Instance.telemetry.time({
          name: 'YMicrocosmAPI',
          message: `Connected ${this.microcosm_uri} @ ${this.provider.signalingUrls.join('')}`,
          level: 'info'
        })
        this.connect()
        timer.finish()

        this.provider.awareness.on('change', this.handleAwareness)
        this.provider.awareness.on('update', this.handleAwareness)
      }
      this.key('status').set({ connected: true })
    } catch (error) {
      this.key('status').set({ connected: false })
      throw Instance.telemetry.catch(
        {
          name: 'YMicrocosmAPI',
          message: 'Error creating provider',
          level: 'warn'
        },
        error
      )
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
        const id = createUuid('node')
        this.doc.collection.set(id, node)
        return id
      } else {
        throw Instance.telemetry.throw({
          name: 'createNode',
          message: `Invalid node: ${JSON.stringify(newNode)}`,
          level: 'warn'
        })
      }
    } catch (error) {
      throw Instance.telemetry.catch(
        {
          name: 'createNode',
          message: `Could not create node`,
          level: 'warn'
        },
        error
      )
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
    ...u: [string, NodeUpdate<T>][]
  ) =>
    this.doc.transact(
      async () => await Promise.all(u.map(([node_id, update]) => this.doc.update(node_id, update)))
    )

  public patch: EditableMicrocosmAPI['patch'] = async <T extends NodeType>(
    node_id: string,
    patch: NodePatch<T>
  ) => {
    const target = this.doc.collection.get(node_id)
    if (target) {
      this.doc.update(node_id, patch(target as Node<T>))
    }
  }

  /**
   * Deletes an array of {@link Node}s
   */
  public delete: EditableMicrocosmAPI['delete'] = (node_id: string | string[]) => {
    this.doc.transact(() => {
      if (isArray(node_id)) {
        for (const n of node_id) {
          this.doc.collection.delete(n)
        }
      } else {
        this.doc.collection.delete(node_id)
      }
    })
  }

  /**
   * Deletes all the user's {@link Node}s.
   */
  public deleteAll = () => {
    for (const [n] of this.doc.collection.entries()) {
      this.delete(n)
    }
  }

  public nodes: EditableMicrocosmAPI['nodes'] = (type) => getNodesByType(this.doc.nodes(), type)

  public node: EditableMicrocosmAPI['node'] = <T extends NodeType>(
    node_id: string,
    type?: T
  ): Node<T> | undefined => {
    const target = this.doc.collection.get(node_id)
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
    user_id: string
  ) => {
    const state = signal<NodeReference[]>(() => [])
    this.onDispose(
      state.dispose,
      this.doc.subscribeToCollection(user_id, (nodes) => {
        state.set(nodes)
      })
    )
    return state
  }

  public getCollection: EditableMicrocosmAPI['getCollection'] = this.doc.collectionToNodes

  /**
   * Joins the Microcosm, publishing identity status to connected peers
   */
  public join: EditableMicrocosmAPI['join'] = (username) => {
    Instance.telemetry.log({
      name: 'MicrocosmAPI',
      message: `Joined ${this.microcosm_uri}`,
      level: 'info'
    })
    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: true,
      username
    } as IdentityWithStatus)
  }
  /**
   * Leaves the Microcosm, publishing identity status to connected peers
   */
  public leave: EditableMicrocosmAPI['leave'] = (username) => {
    Instance.telemetry.log({
      name: 'MicrocosmAPI',
      message: `Left ${this.microcosm_uri}`,
      level: 'info'
    })

    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: false,
      username
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

  public boxes: EditableMicrocosmAPI['boxes'] = () => this.nodes('html')
}
