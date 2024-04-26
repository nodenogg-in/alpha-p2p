import {
  type MicrocosmAPIConfig,
  type MicrocosmAPI,
  type IdentityWithStatus,
  type NodeType,
  type Node,
  type NodeID,
  type IdentityID,
  type NodeCreate,
  EditableMicrocosmAPI,
  isIdentityWithStatus
} from '@nodenogg.in/microcosm'
import type { Telemetry } from '@nodenogg.in/microcosm/telemetry'
import { isArray } from '@figureland/typekit/guards'
import { promiseSome } from '@figureland/typekit/promise'

import type { Provider, ProviderFactory } from './provider'
import type { Persistence, PersistenceFactory } from './persistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'

export class YMicrocosmAPI extends EditableMicrocosmAPI {
  private readonly doc = new YMicrocosmDoc()
  private persistence!: Persistence[]
  private providers!: Provider[]
  /**
   * Creates a new Microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(
    config: MicrocosmAPIConfig,
    private readonly providerFactories?: ProviderFactory[],
    private readonly persistenceFactories?: PersistenceFactory[],
    protected telemetry?: Telemetry
  ) {
    super(config, telemetry)
    this.doc.init(this.identityID)

    this.createPersistences()
    this.createProviders()
      .then(() => {
        this.state.key('status').set({ ready: true })
      })
      .catch(this.telemetry?.catch)

    this.manager.use(() => {
      // Notify that the Microcosm is no longer ready
      this.offReady()
      // Notify peers that the user has left the Microcosm
      this.leave()
      // Disconnect providers
      this.disconnectProviders()
      // Destroy providers
      this.destroyProviders()
      // Dispose the YMicrocosmAPIDoc instance
      this.doc.dispose()
      // Destroy the local persistence instance
      this.destroyPersistence()
    })
  }

  public updatePassword = async (password: string) => {
    if (password === this.password) {
      this.disconnectProviders()
      await this.offReady()
      this.password = password
      await this.onReady()
    }
  }

  // private createPersistence = () => {
  //   this.persistence = new IndexedDBPersistence(this.microcosmID, this.doc)
  //   this.persistence.on('synced', this.onReady)
  // }
  /**
   * Triggered when the {@link MicrocosmAPI} is ready
   */
  private onReady = async () => {}

  /**
   * Triggered when the {@link MicrocosmAPI} is no longer ready
   */
  private offReady = async () => {
    this.state.key('status').set({ ready: false })
  }

  private disconnectProviders = async () => {
    this.providers?.forEach((p) => {
      p.shouldConnect = false
      p.disconnect()
    })
    this.state.key('status').set({ connected: false })
  }

  private destroyProviders = () => {
    this.providers?.forEach((p) => p.destroy())
  }

  private destroyPersistence = () => {
    this.persistence?.forEach((p) => p.destroy())
  }

  private createPersistences = async () => {
    try {
      if (!this.persistenceFactories) {
        return
      }
      const { fulfilled, rejected } = await promiseSome(
        this.persistenceFactories.map(this.createPersistence)
      )

      if (fulfilled.length > 0) {
        this.persistence = fulfilled

        this.state.key('status').set({
          ready: true
        })
      } else {
        throw this.telemetry?.throw({
          name: 'YMicrocosmAPI',
          level: 'warn',
          message: `No persistence available (${rejected.length} failed)`
        })
      }
    } catch (error) {
      this.state.key('status').set({
        ready: false
      })
      throw this.telemetry?.catch(error)
    }
  }

  private createPersistence = async (factory: PersistenceFactory) => {
    try {
      const timer = this.telemetry?.time({
        name: 'YMicrocosmAPI',
        message: `Persisted ${this.microcosmID}`,
        level: 'info'
      })
      const result = await factory(this.microcosmID, this.doc)
      timer?.finish()
      return result
    } catch (error) {
      throw this.telemetry?.catch(error)
    }
  }

  private createProvider = async (factory: ProviderFactory) => {
    try {
      const timer = this.telemetry?.time({
        name: 'YMicrocosmAPI',
        message: `Connected ${this.microcosmID}`,
        level: 'info'
      })
      const result = await factory(this.microcosmID, this.doc, this.password)
      timer?.finish()
      return result
    } catch (error) {
      throw this.telemetry?.catch(error)
    }
  }

  private getProvider = (fn: (p: Provider, ps: Provider[]) => void) => {
    if (this.providers[0]) {
      fn(this.providers[0], this.providers)
    }
  }

  private createProviders = async () => {
    try {
      if (!this.providerFactories) {
        return
      }
      const { fulfilled, rejected } = await promiseSome(
        this.providerFactories.map(this.createProvider)
      )

      if (fulfilled.length > 0) {
        this.providers = fulfilled

        this.getProvider((p) => {
          p.awareness.on('change', this.handleAwareness)
          p.awareness.on('update', this.handleAwareness)
        })

        this.providers?.forEach((p) => {
          p.shouldConnect = true
          p.connect()
        })

        this.state.key('status').set({
          connected: true
        })
      } else {
        throw this.telemetry?.throw({
          name: 'YMicrocosmAPI',
          level: 'warn',
          message: `No providers available (${rejected.length} failed)`
        })
      }
    } catch (error) {
      this.state.key('status').set({
        connected: false
      })
      throw this.telemetry?.catch(error)
    }
  }

  private handleAwareness = () => {
    this.getProvider((p) => {
      this.state.key('identities').set(
        Array.from(p.awareness.getStates())
          .map(([, state]) => state?.identity || {})
          .filter(isIdentityWithStatus)
      )
    })
  }

  /**
   * Erases this Microcosm's locally stored content and disposes this instance
   */
  public clearPersistence = (reset?: boolean) => {
    this.persistence?.forEach((p) => {
      p.clearData()
      p.destroy()
    })

    if (reset) {
      this.createPersistences()
    }
  }

  /**
   * Creates a new {@link Node}
   */
  private createNode: NodeCreate = (newNode) => {
    try {
      return this.doc.create(newNode)
    } catch (error) {
      throw this.telemetry?.catch(error)
    }
  }

  /**
   * Creates a new {@link Node}
   */
  public create: EditableMicrocosmAPI['create'] = (n) => this.doc.transact(() => this.createNode(n))

  /**
   * Updates one or more {@link Node}s
   */
  public update: EditableMicrocosmAPI['update'] = (node_id, u) =>
    this.doc.transact(() => this.doc.update(node_id, u))

  /**
   * Deletes an array of {@link Node}s
   */
  public delete: EditableMicrocosmAPI['delete'] = (node_id: NodeID | NodeID[]) => {
    this.doc.transact(() => {
      if (isArray(node_id)) {
        node_id.forEach((id) => this.doc.delete(id))
      } else {
        this.doc.delete(node_id)
      }
    })
  }

  public nodes: EditableMicrocosmAPI['nodes'] = (type) => []

  public node: EditableMicrocosmAPI['node'] = <T extends NodeType>(
    identityID: IdentityID,
    node_id: NodeID,
    type?: T
  ) => this.doc.node<T>(identityID, node_id, type)

  public collections: EditableMicrocosmAPI['collections'] = () => this.doc.collections
  public collection: EditableMicrocosmAPI['collection'] = this.doc.collection

  /**
   * Joins the Microcosm, publishing identity status to connected peers
   */
  public join: EditableMicrocosmAPI['join'] = (nickname) => {
    this.telemetry?.log({
      name: 'MicrocosmAPI',
      message: `Joined ${this.microcosmID}`,
      level: 'info'
    })
    this.getProvider((p) => {
      p.awareness.setLocalStateField('identity', {
        identityID: this.identityID,
        joined: true,
        nickname
      } as IdentityWithStatus)
    })
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

    this.getProvider((p) => {
      p.awareness.setLocalStateField('identity', {
        identityID: this.identityID,
        joined: false,
        nickname
      } as IdentityWithStatus)
    })
  }

  /**
   * Destroys the Microcosm's content and disposes this instance
   */
  public destroy = () => {
    this.clearPersistence()
    this.dispose()
  }

  public dispose = () => {
    this.manager.dispose()
  }

  public undo: EditableMicrocosmAPI['undo'] = () => this.doc.undo()

  public redo: EditableMicrocosmAPI['redo'] = () => this.doc.redo()

  public boxes = () => this.nodes('html')
}
