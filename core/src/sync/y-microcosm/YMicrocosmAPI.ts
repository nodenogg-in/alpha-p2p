import { is } from 'valibot'

import { identityStatusSchema, type Unsubscribe, type IdentityWithStatus } from '../../schema'
import type { Provider, ProviderFactory } from './provider'
import type { EditableMicrocosmAPI, MicrocosmConfig, MicrocosmAPI } from '../microcosm/api'
import type { EditableMicrocosmAPIEvents } from '../microcosm/MicrocosmAPI'
import { IndexedDBPersistence } from './IndexedDBPersistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'
import { State } from '../../utils'
import { getNodesByType } from '../microcosm/query'

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
      this.sub = this.subscribeToCollections((collections) => {
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
        this.connect()
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

  public deleteAll: EditableMicrocosmAPI['deleteAll'] = () => this.doc.deleteAll()

  public create: EditableMicrocosmAPI['create'] = this.doc.create

  public update: EditableMicrocosmAPI['update'] = this.doc.update

  public delete: EditableMicrocosmAPI['delete'] = this.doc.delete

  public nodes: EditableMicrocosmAPI['nodes'] = (type) => getNodesByType(this.doc.nodes(), type)

  public subscribeToCollections: EditableMicrocosmAPI['subscribeToCollections'] =
    this.doc.subscribeToCollections

  public getCollections: EditableMicrocosmAPI['getCollections'] = this.doc.getCollections

  /**
   * Subscribes to a collection
   */
  public subscribeToCollection: EditableMicrocosmAPI['subscribeToCollection'] =
    this.doc.subscribeToCollection

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
