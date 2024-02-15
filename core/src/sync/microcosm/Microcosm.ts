import type { Awareness } from 'y-protocols/awareness'
import { is } from 'valibot'

import { type Node, IdentityWithStatus, identityStatusSchema } from '../schema'
import { type Box, type Point, type BoxReference, intersect } from '../../canvas'
import { IndexedDBPersistence } from '../persistence/IndexedDBPersistence'
import { Emitter, type Unsubscribe } from '../../utils/emitter/Emitter'
import { YMicrocosmDoc } from './YMicrocosmDoc'

type Persistence = IndexedDBPersistence

type IMicrocosm = {
  microcosm_uri: string
  user_id: string
  password?: string
  provider?: ProviderFactory
}

export type ProviderFactory<T extends Provider = Provider> = (
  microcosm_id: string,
  doc: YMicrocosmDoc,
  password?: string
) => Promise<T>

export interface Provider {
  awareness: Awareness
  destroy: () => void
  disconnect: () => void
  connect: () => void
  shouldConnect: boolean
}

export type NodeReference = BoxReference<Node>
export type NodeCollection = [string, NodeReference[]]

type MicrocosmEvents = {
  ready: boolean
  connected: boolean
  identities: IdentityWithStatus[]
}

export class Microcosm extends Emitter<MicrocosmEvents> {
  public readonly doc: YMicrocosmDoc
  public readonly microcosm_uri: string
  public readonly user_id: string
  public readonly password?: string
  private persistence!: Persistence
  private provider!: Provider
  private makeProvider!: ProviderFactory

  /**
   * Creates a new microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor({ microcosm_uri, user_id, password, provider }: IMicrocosm) {
    super()

    this.microcosm_uri = microcosm_uri
    this.user_id = user_id
    this.password = password

    this.doc = new YMicrocosmDoc(this.user_id)

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
    if (this.makeProvider) {
      await this.createProvider(this.makeProvider)
    }

    this.emit('ready', true)
  }

  /**
   * Triggered when the {@link Microcosm} is no longer ready
   */
  private offReady = async () => {
    this.emit('ready', false)
  }

  private createProvider = async (getProvider: ProviderFactory) => {
    try {
      this.provider = await getProvider(this.microcosm_uri, this.doc, this.password)
      this.connect()
      this.provider.awareness.on('change', this.handleAwareness)
      this.provider.awareness.on('update', this.handleAwareness)
      this.emit('connected', true)
    } catch (e) {
      this.emit('connected', false)
    }
  }

  private handleAwareness = () => {
    const identities = Array.from(this.provider.awareness.getStates())
      .map(([, state]) => state?.identity || {})
      .filter((identity) => is(identityStatusSchema, identity))

    this.emit('identities', identities)
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
  public connect = () => {
    if (this.provider) {
      this.provider.shouldConnect = true
      // Connect the provider instance
      this.provider.connect()
      this.emit('connected', true)
    }
  }

  /**
   * Disconnects this microcosm's {@link Y.Doc} instance from its {@link Provider}
   */
  public disconnect = () => {
    this.provider.shouldConnect = false
    // Disconnect the provider instance
    this.provider?.disconnect()
    this.emit('connected', false)
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

  public deleteAll = () => this.doc.deleteAll()

  public create = (n: Node | Node[]): string | string[] => this.doc.create(n)

  public update = (node_id: string, update: Partial<Node>) => this.doc.update(node_id, update)

  public delete = (node_id: string) => this.doc.delete(node_id)

  public nodes = () => this.doc.nodes()

  public subscribeToCollections = (fn: (data: string[]) => void): Unsubscribe =>
    this.doc.subscribeToCollections(fn)

  public subscribeAll = (fn: (data: NodeReference[]) => void): Unsubscribe =>
    this.doc.subscribeAll(fn)

  /**
   * Subscribes to a collection
   */
  public subscribeToCollection = (
    user_id: string,
    fn: (data: NodeReference[]) => void
  ): Unsubscribe => this.doc.subscribeToCollection(user_id, fn)
  /**
   * Retrieves nodes that intersect with a given point and box
   */
  public intersect = (point: Point, box: Box) => intersect(this.doc.nodes(), point, box)
  /**
   * Joins the microcosm, publishing identity status to connected peers
   */
  public join = (username?: string): void =>
    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: true,
      ...(username && { username })
    } as IdentityWithStatus)

  /**
   * Leaves the microcosm, publishing identity status to connected peers
   */
  public leave = (username?: string) =>
    this.provider?.awareness.setLocalStateField('identity', {
      user_id: this.user_id,
      joined: false,
      ...(username && { username })
    } as IdentityWithStatus)

  public undo = () => this.doc.undo()

  public redo = () => this.doc.redo()
}
