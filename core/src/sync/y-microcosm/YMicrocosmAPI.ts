import { is } from 'valibot'

import {
  identityStatusSchema,
  type Unsubscribe,
  type IdentityWithStatus,
  NodeType,
  Node,
  isNodeType,
  NewNode,
  nodeSchema,
  NodeReference
} from '../../schema'
import type { Provider, ProviderFactory } from './provider'
import type { EditableMicrocosmAPI, EditableMicrocosmAPIEvents } from '../MicrocosmAPI.schema'
import { IndexedDBPersistence } from './IndexedDBPersistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'
import { State, createUuid } from '../../utils'
import { getNodesByType } from '../microcosm/query'
import { MicrocosmConfig } from '../microcosm/Microcosm'
import { NodePatch, NodeUpdate, createNode } from '../microcosm/update'
import { isArray } from 'lib0/array'
import { Instance } from '../../app/Instance'

export class YMicrocosmAPI
  extends State<EditableMicrocosmAPIEvents>
  implements EditableMicrocosmAPI
{
  public readonly microcosm_uri: string
  private readonly doc = new YMicrocosmDoc()
  private readonly user_id: string
  private readonly makeProvider!: ProviderFactory
  private password?: string
  private persistence!: IndexedDBPersistence
  private provider!: Provider
  public sub!: Unsubscribe
  /**
   * Creates a new microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor({
    microcosm_uri,
    user_id,
    password,
    provider
  }: MicrocosmConfig & {
    provider?: ProviderFactory
  }) {
    super({
      initial: () => ({
        status: {
          connected: false,
          ready: false
        },
        identities: [],
        collections: []
      })
    })

    this.microcosm_uri = microcosm_uri
    this.user_id = user_id
    this.password = password

    this.doc.init(this.user_id)

    if (provider) {
      this.makeProvider = provider
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
    await this.createProvider()
    if (!this.sub) {
      this.sub = this.doc.subscribeToCollections((collections) => {
        this.setKey('collections', collections)
      })
    }
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
      if (!this.makeProvider) {
        throw new Error('Could not sync YMicrocosm: No provider specified')
      }
      if (!this.provider) {
        this.provider = await this.makeProvider(this.microcosm_uri, this.doc, this.password)
        const end = Instance.telemetry.time({
          name: YMicrocosmAPI.name,
          message: `Connected ${this.microcosm_uri} @ ${this.provider.signalingUrls.join('')}`,
          level: 'info'
        })
        this.connect()
        end()

        this.provider.awareness.on('change', this.handleAwareness)
        this.provider.awareness.on('update', this.handleAwareness)
      }
      this.setKey('status', () => ({
        connected: true
      }))
    } catch (e) {
      this.setKey('status', () => ({
        connected: false
      }))
    }
  }

  private handleAwareness = () => {
    const identities = Array.from(this.provider.awareness.getStates())
      .map(([, state]) => state?.identity || {})
      .filter((identity) => is(identityStatusSchema, identity))

    this.setKey('identities', identities)
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
  public clearPersistence: EditableMicrocosmAPI['clearPersistence'] = (reset) => {
    // Delete all the locally-stored data
    this.persistence.clearData()
    if (reset) {
      this.createPersistence()
    }
  }

  /**
   * Creates a new {@link Node}
   */
  private createNode = (newNode: NewNode) => {
    try {
      const node = createNode(newNode)
      if (is(nodeSchema, node)) {
        const id = createUuid('node')
        this.doc.collection.set(id, node)
        return id
      } else {
        throw new Error()
      }
    } catch (e) {
      throw e || new Error(`${newNode} is not a valid node type`)
    }
  }

  /**
   * Creates a new {@link Node}
   */
  public create: EditableMicrocosmAPI['create'] = (n) =>
    this.doc.transact(() => {
      if (isArray(n)) {
        return n.map(this.createNode)
      } else {
        return this.createNode(n)
      }
    })

  /**
   * Updates one or more {@link Node}s
   */
  public update: EditableMicrocosmAPI['update'] = <T extends NodeType>(u: NodeUpdate<T>[]) =>
    this.doc.transact(() => {
      for (const update of u) {
        this.doc.update(update)
      }
    })

  public patch: EditableMicrocosmAPI['patch'] = <T extends NodeType>(
    node_id: string,
    type: T,
    patch: NodePatch<T>
  ) => {
    const target = this.doc.collection.get(node_id)
    if (target) {
      this.doc.update([node_id, type, patch(target as Node<T>)])
    }
  }

  /**
   * Deletes a {@link Node}
   */
  public delete: EditableMicrocosmAPI['delete'] = (node_id: string | string[]) => {
    this.doc.transact(() => {
      if (isArray(node_id)) {
        for (const n of node_id) {
          this.deleteNode(n)
        }
      } else {
        this.deleteNode(node_id)
      }
    })
  }

  /**
   * Creates one of the user's {@link Node}s
   */
  private deleteNode = (node_id: string): void => {
    this.doc.collection.delete(node_id)
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

  public getCollection: EditableMicrocosmAPI['getCollection'] = this.doc.collectionToNodes

  /**
   * Joins the microcosm, publishing identity status to connected peers
   */
  public join: EditableMicrocosmAPI['join'] = (username) =>
    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: true,
      username
    } as IdentityWithStatus)

  /**
   * Leaves the microcosm, publishing identity status to connected peers
   */
  public leave: EditableMicrocosmAPI['leave'] = (username) =>
    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: false,
      username
    } as IdentityWithStatus)

  public undo: EditableMicrocosmAPI['undo'] = () => this.doc.undo()

  public redo: EditableMicrocosmAPI['redo'] = () => this.doc.redo()
}
