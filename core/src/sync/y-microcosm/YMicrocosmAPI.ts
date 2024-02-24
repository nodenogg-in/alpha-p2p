import { is } from 'valibot'

import {
  identityStatusSchema,
  type IdentityWithStatus,
  type NodeReference,
  type NodeType
} from '../../schema'
import type { Provider, ProviderFactory } from './provider'
import type {
  EditableMicrocosmAPI,
  MicrocosmAPIEvents,
  MicrocosmConfig,
  MicrocosmAPI
} from '../microcosm/api'
import { IndexedDBPersistence } from './IndexedDBPersistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'
import { State } from '../../utils'
import { intersect } from '../../spatial/intersection'

export class YMicrocosmAPI extends State<MicrocosmAPIEvents> implements EditableMicrocosmAPI {
  private readonly doc = new YMicrocosmDoc()
  private readonly microcosm_uri: string
  private readonly user_id: string
  private readonly password?: string
  private readonly makeProvider!: ProviderFactory
  private persistence!: IndexedDBPersistence
  private provider!: Provider

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
        data: {
          identities: [],
          collections: [],
          collection: []
        }
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
  }

  private createPersistence = () => {
    this.persistence = new IndexedDBPersistence(this.microcosm_uri, this.doc)
    this.persistence.on('synced', this.onReady)
  }
  /**
   * Triggered when the {@link Microcosm} is ready
   */
  private onReady = async () => {
    await this.createProvider(this.makeProvider)
    this.subscribeToCollections((collections) => this.set('data', { collections }))
    this.set('status', { ready: true })
  }

  /**
   * Triggered when the {@link Microcosm} is no longer ready
   */
  private offReady = async () => {
    this.set('status', { ready: false })
  }

  private createProvider = async (getProvider: ProviderFactory) => {
    try {
      if (!getProvider) {
        throw new Error('Could not sync YMicrocosm: No provider specified')
      }
      if (!this.provider) {
        this.provider = await getProvider(this.microcosm_uri, this.doc, this.password)
        this.connect()
        this.provider.awareness.on('change', this.handleAwareness)
        this.provider.awareness.on('update', this.handleAwareness)
      }
      this.set('status', { connected: true })
    } catch (e) {
      this.set('status', { connected: false })
    }
  }

  private handleAwareness = () => {
    const identities = Array.from(this.provider.awareness.getStates())
      .map(([, state]) => state?.identity || {})
      .filter((identity) => is(identityStatusSchema, identity))

    this.set('data', { identities })
  }

  /**
   * Disposes of this instance, meaning it can't be used again.
   * To reconnect, create another {@link Microcosm}
   */
  public dispose: MicrocosmAPI['dispose'] = () => {
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
    // Remove all connected event listeners
    this.clearListeners()
  }

  /**
   * Connects this microcosm's {@link Y.Doc} instance to its {@link Provider}
   */
  private connect = () => {
    if (this.provider) {
      this.provider.shouldConnect = true
      // Connect the provider instance
      this.provider.connect()
      this.set('data', { connected: true })
    }
  }

  /**
   * Disconnects this microcosm's {@link Y.Doc} instance from its {@link Provider}
   */
  private disconnect = () => {
    this.provider.shouldConnect = false
    // Disconnect the provider instance
    this.provider?.disconnect()
    this.set('data', { connected: false })
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

  public deleteAll: EditableMicrocosmAPI['deleteAll'] = () => this.doc.deleteAll()

  public create: EditableMicrocosmAPI['create'] = this.doc.create

  public update: EditableMicrocosmAPI['update'] = this.doc.update

  public delete: EditableMicrocosmAPI['delete'] = this.doc.delete

  public nodes: MicrocosmAPI['nodes'] = this.doc.nodes

  public nodesByType: MicrocosmAPI['nodesByType'] = <T extends NodeType>(
    type?: T
  ): NodeReference<T>[] =>
    this.nodes().filter((node: NodeReference) => node[1].type === type) as NodeReference<T>[]

  public subscribeToCollections: EditableMicrocosmAPI['subscribeToCollections'] =
    this.doc.subscribeToCollections

  /**
   * Subscribes to a collection
   */
  public subscribeToCollection: EditableMicrocosmAPI['subscribeToCollection'] =
    this.doc.subscribeToCollection

  /**
   * Retrieves nodes that intersect with a given point and box
   */
  public intersect: MicrocosmAPI['intersect'] = (point, box) =>
    intersect(this.nodesByType('html'), point, box)
  /**
   * Joins the microcosm, publishing identity status to connected peers
   */
  public join: EditableMicrocosmAPI['join'] = (username) =>
    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: true,
      ...(username && { username })
    } as IdentityWithStatus)

  /**
   * Leaves the microcosm, publishing identity status to connected peers
   */
  public leave: EditableMicrocosmAPI['leave'] = (username) =>
    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: false,
      ...(username && { username })
    } as IdentityWithStatus)

  public undo: EditableMicrocosmAPI['undo'] = () => this.doc.undo()

  public redo: EditableMicrocosmAPI['redo'] = () => this.doc.redo()
}
