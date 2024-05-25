import {
  type Entity,
  type IdentityID,
  type EntityID,
  type EntityUpdatePayload,
  type EntityCreate,
  type MicrocosmAPIConfig,
  type Identity,
  type IdentityWithStatus,
  isValidIdentityID,
  update,
  create,
  isEntity,
  isIdentityWithStatus
} from '@nodenogg.in/microcosm'
import type { Signed } from '@nodenogg.in/microcosm/crypto'
import {
  TelemetryError,
  collectTelemetryErrors,
  isTelemetryEvent
} from '@nodenogg.in/microcosm/telemetry'
import { Manager, signal } from '@figureland/statekit'
import { promiseSome } from '@figureland/typekit'
import { Doc, UndoManager, Map as YMap } from 'yjs'

import type { Persistence, PersistenceFactory } from './persistence'
import type { Provider, ProviderFactory } from './provider'

type SignedEntity = Signed<Entity>

export type YMicrocosmDocOptions = {
  readonly config: MicrocosmAPIConfig
  readonly providers?: ProviderFactory[]
  readonly persistence?: PersistenceFactory[]
}

export class YMicrocosmDoc extends Manager {
  private readonly yDoc = new Doc()
  public readonly identities = this.yDoc.getMap<boolean>('identities')
  public readonly state = signal(() => ({
    identities: [] as IdentityWithStatus[],
    persisted: false,
    connected: false
  }))

  private persistence!: Persistence[]
  private providers!: Provider[]
  private identity_id!: IdentityID
  private undoManager: UndoManager
  private collection: YMap<SignedEntity>
  private providerFactories?: ProviderFactory[]
  private persistenceFactories?: PersistenceFactory[]
  private config: MicrocosmAPIConfig

  constructor({ config, providers, persistence }: YMicrocosmDocOptions) {
    super()
    this.config = structuredClone(config)
    this.providerFactories = providers
    this.persistenceFactories = persistence
  }
  public getCollectionIDs = (): IdentityID[] =>
    Array.from(this.identities.keys()).filter(isValidIdentityID)

  public init = async () => {
    try {
      await this.createPersistences()
      await this.createProviders()
    } catch (error) {
      throw error
    }
  }

  public identify = (identity_id: IdentityID) => {
    if (this.identity_id !== identity_id) {
      this.identity_id = identity_id
      this.undoManager?.destroy()
      this.collection = this.getYCollection(identity_id)
      this.undoManager = new UndoManager(this.collection)
      this.identities.set(identity_id, true)
    }
  }

  public getYCollection = (identity_id: IdentityID) => this.yDoc.getMap<SignedEntity>(identity_id)

  /**
   * Updates a single {@link Entity}
   */
  public update = (entity_id: EntityID, u: EntityUpdatePayload) => {
    if (!this.collection) {
      throw new TelemetryError({
        level: 'warn',
        message: 'No identity available for microcosm operations',
        name: 'YMicrocosmAPI'
      })
    }
    const target = this.collection.get(entity_id)
    if (isEntity(target)) {
      const signed = {
        signature: '',
        data: update(target, u)
      }
      this.collection.set(entity_id, signed)
    }
  }

  public create: EntityCreate = (newEntity) => {
    if (!this.collection) {
      throw new TelemetryError({
        level: 'warn',
        message: 'No identity available for microcosm operations',
        name: 'YMicrocosmAPI'
      })
    }

    const entity = create(newEntity)
    const payload = { signature: '', data: entity }
    this.collection.set(entity.id, payload)
    return entity
  }

  public delete = (entity_id: EntityID) => {
    if (!this.collection) {
      throw new TelemetryError({
        level: 'warn',
        message: 'No identity available for microcosm operations',
        name: 'YMicrocosmAPI'
      })
    }
    this.collection?.delete(entity_id)
  }

  public undo = () => {
    this.undoManager?.undo()
  }

  public redo = () => {
    this.undoManager?.redo()
  }

  public dispose = () => {
    this.yDoc.destroy()
    this.undoManager?.destroy()
  }

  private createPersistence = async (createPersistenceFn: PersistenceFactory) => {
    const { microcosmID } = this.config
    try {
      const persistence = await createPersistenceFn(microcosmID, this.yDoc)
      return persistence
    } catch (error) {
      throw new TelemetryError({
        name: 'YMicrocosmDoc',
        message: `Could not create persistence for ${microcosmID}`,
        level: 'fail'
      })
    }
  }

  private createProvider = async (createProviderFn: ProviderFactory) => {
    const { microcosmID, password } = this.config

    try {
      const provider = await createProviderFn(microcosmID, this.yDoc, password)
      return provider
    } catch (error) {
      throw new TelemetryError({
        name: 'YMicrocosmDoc',
        message: `Could not create provider for ${microcosmID}`,
        level: 'warn'
      })
    }
  }

  private createPersistences = async () => {
    try {
      if (!this.persistenceFactories) {
        throw new TelemetryError({
          name: 'YMicrocosmDoc',
          message: `No persistence methods available`,
          level: 'warn'
        })
      }
      const { fulfilled, rejected } = await promiseSome(
        this.persistenceFactories.map(this.createPersistence)
      )

      if (fulfilled.length === 0) {
        const reasons = collectTelemetryErrors(rejected)

        throw new TelemetryError({
          name: 'YMicrocosmAPI',
          level: 'warn',
          message: `No persistence available (${rejected.length}/${this.persistenceFactories.length} failed: ${reasons.join(', ')})`
        })
      }

      this.persistence = fulfilled

      this.state.set({
        persisted: true
      })

      return this.persistence
    } catch (error) {
      this.state.set({
        persisted: false
      })
      throw error
    }
  }

  private createProviders = async () => {
    try {
      if (!this.providerFactories) {
        throw new TelemetryError({
          name: 'YMicrocosmDoc',
          message: `No providers available`,
          level: 'warn'
        })
      }
      const { fulfilled, rejected } = await promiseSome(
        this.providerFactories.map(this.createProvider)
      )

      if (fulfilled.length === 0) {
        const reasons = collectTelemetryErrors(rejected)

        throw new TelemetryError({
          name: 'YMicrocosmAPI',
          level: 'warn',
          message: `No providers available (${rejected.length}/${this.providerFactories.length} failed: ${reasons.join(', ')})`
        })
      }

      this.providers = fulfilled
      this.provider?.awareness.on('change', this.handleAwareness)
      this.provider?.awareness.on('update', this.handleAwareness)

      this.providers?.forEach((p) => {
        p.shouldConnect = true
        p.connect()
      })

      this.state.set({
        connected: true
      })

      return this.providers
    } catch (error) {
      this.state.set({
        connected: false
      })
      throw error
    }
  }

  private disconnectProviders = async () => {
    this.provider?.awareness.off('change', this.handleAwareness)
    this.provider?.awareness.off('update', this.handleAwareness)
    this.providers?.forEach((p) => {
      p.shouldConnect = false
      p.disconnect()
    })
    this.state.set({
      identities: [],
      connected: false
    })
  }

  private destroyProviders = () => {
    this.providers?.forEach((p) => p.destroy())
  }

  private destroyPersistence = () => {
    this.persistence?.forEach((p) => p.destroy())
  }

  public get provider(): Provider | undefined {
    return this.providers[0]
  }

  public updatePassword = async (password: string) => {
    if (password === this.config.password) {
      await this.disconnectProviders()
      this.config.password = password
      await this.createProviders()
    }
  }

  private handleAwareness = () => {
    if (!this.provider) {
      return
    }

    this.state.set({
      identities: Array.from(this.provider.awareness.getStates())
        .map(([, state]) => state?.identity || {})
        .filter(isIdentityWithStatus)
    })
  }

  /**
   * Erases this Microcosm's locally stored content and disposes this instance
   */
  public clearPersistence = async (reset?: boolean) => {
    this.persistence?.forEach((p) => {
      p.clearData()
      p.destroy()
    })

    if (reset) {
      await this.createPersistences()
    }
  }

  public destroy = () => {
    this.clearPersistence()
  }

  public join = (identity: Identity) => {
    this.provider?.awareness.setLocalStateField('identity', {
      ...identity,
      joined: true
    } as IdentityWithStatus)
  }

  public leave = (identity: Identity) => {
    this.provider?.awareness.setLocalStateField('identity', {
      ...identity,
      joined: false
    } as IdentityWithStatus)
  }
}
