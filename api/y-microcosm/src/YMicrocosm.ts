import { is } from 'valibot'
import {
  type NodePatch,
  type NodeUpdate,
  createNode,
  getNodesByType,
  Instance,
  createUuid,
  Microcosm,
  EditableMicrocosm,
  BaseMicrocosm,
  MicrocosmConfig
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
import { State } from '@nodenogg.in/state'
import { isArray } from '@nodenogg.in/utils'

import type { Provider, ProviderFactory } from './provider'
import { IndexedDBPersistence } from './IndexedDBPersistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'

export class YMicrocosm extends BaseMicrocosm implements EditableMicrocosm {
  private readonly doc = new YMicrocosmDoc()
  private persistence!: IndexedDBPersistence
  private provider!: Provider
  /**
   * Creates a new microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(
    config: MicrocosmConfig,
    private readonly providerFactory?: ProviderFactory
  ) {
    super(config)
    this.doc.init(this.user_id)

    if (this.providerFactory) {
      this.createPersistence()
    }

    this.onDispose(() => {
      // Notify that the microcosm is no longer ready
      this.offReady()
      // Notify peers that the user has left the microcosm
      this.leave()
      // Disconnect the provider
      this.disconnect()
      // Destroy the provider instance
      this.provider?.destroy()
      // Dispose the YMicrocosmDoc instance
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
   * Triggered when the {@link Microcosm} is ready
   */
  private onReady = async () => {
    this.createProvider().catch(Instance.telemetry.catch)
    this.onDispose(
      this.doc.subscribeToCollections((collections) => {
        this.setKey('collections', collections)
      })
    )
    this.setKey('status', () => ({ ready: true }))
  }

  /**
   * Triggered when the {@link Microcosm} is no longer ready
   */
  private offReady = async () => {
    this.setKey('status', () => ({ ready: false }))
  }

  private createProvider = async () => {
    try {
      if (!this.providerFactory) {
        throw Instance.telemetry.throw({
          name: 'YMicrocosm',
          message: `Could not sync YMicrocosm: no provider specified`,
          level: 'info'
        })
      }
      if (!this.provider) {
        this.provider = await this.providerFactory(this.microcosm_uri, this.doc, this.password)
        const timer = Instance.telemetry.time({
          name: 'YMicrocosm',
          message: `Connected ${this.microcosm_uri} @ ${this.provider.signalingUrls.join('')}`,
          level: 'info'
        })
        this.connect()
        timer.finish()

        this.provider.awareness.on('change', this.handleAwareness)
        this.provider.awareness.on('update', this.handleAwareness)
      }
      this.setKey('status', () => ({
        connected: true
      }))
    } catch (error) {
      this.setKey('status', () => ({
        connected: false
      }))
      throw Instance.telemetry.catch(
        {
          name: 'YMicrocosm',
          message: 'Error creating provider',
          level: 'warn'
        },
        error
      )
    }
  }

  private handleAwareness = () => {
    this.setKey(
      'identities',
      Array.from(this.provider.awareness.getStates())
        .map(([, state]) => state?.identity || {})
        .filter((identity) => is(identityStatusSchema, identity))
    )
  }

  /**
   * Connects this microcosm's {@link Y.Doc} instance to its {@link Provider}
   */
  private connect = () => {
    if (this.provider) {
      this.provider.shouldConnect = true
      // Connect the provider instance
      this.provider.connect()
      this.setKey('status', () => ({ connected: true }))
    }
  }

  /**
   * Disconnects this microcosm's {@link Y.Doc} instance from its {@link Provider}
   */
  private disconnect = () => {
    this.provider.shouldConnect = false
    // Disconnect the provider instance
    this.provider?.disconnect()
    this.setKey('status', () => ({ connected: false }))
  }

  /**
   * Erases this microcosm's locally stored content and disposes this instance
   */
  public clearPersistence: EditableMicrocosm['clearPersistence'] = (reset) => {
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
  public create: EditableMicrocosm['create'] = (n) =>
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
  public update: EditableMicrocosm['update'] = <T extends NodeType>(
    ...u: [string, NodeUpdate<T>][]
  ) =>
    this.doc.transact(
      async () => await Promise.all(u.map(([node_id, update]) => this.doc.update(node_id, update)))
    )

  public patch: EditableMicrocosm['patch'] = async <T extends NodeType>(
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
  public delete: EditableMicrocosm['delete'] = (node_id: string | string[]) => {
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

  public nodes: EditableMicrocosm['nodes'] = (type) => getNodesByType(this.doc.nodes(), type)

  public node: EditableMicrocosm['node'] = <T extends NodeType>(
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

  public getCollections: EditableMicrocosm['getCollections'] = this.doc.getCollections

  /**
   * Subscribes to a collection
   */
  public subscribeToCollection: EditableMicrocosm['subscribeToCollection'] = (user_id: string) => {
    const state = new State<{ nodes: NodeReference[] }>({
      initial: () => ({ nodes: [] })
    })
    this.onDispose(
      state.dispose,
      this.doc.subscribeToCollection(user_id, (nodes) => {
        state.setKey('nodes', nodes)
      })
    )
    return state
  }

  public getCollection: EditableMicrocosm['getCollection'] = this.doc.collectionToNodes

  /**
   * Joins the microcosm, publishing identity status to connected peers
   */
  public join: EditableMicrocosm['join'] = (username) => {
    Instance.telemetry.log({
      name: 'Microcosm',
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
   * Leaves the microcosm, publishing identity status to connected peers
   */
  public leave: EditableMicrocosm['leave'] = (username) => {
    Instance.telemetry.log({
      name: 'Microcosm',
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
   * Destroys the microcosm's content and disposes this instance
   */
  public destroy = () => {
    this.clearPersistence()
    this.dispose()
  }

  public undo: EditableMicrocosm['undo'] = () => this.doc.undo()

  public redo: EditableMicrocosm['redo'] = () => this.doc.redo()

  public boxes: EditableMicrocosm['boxes'] = () => this.nodes('html')
}
