import {
  type Entity,
  type IdentityID,
  type EntityID,
  type UpdateEntityPayload,
  type CreateEntity,
  type MicrocosmAPIConfig,
  type Identity,
  type IdentityWithStatus,
  type EntityType,
  type EntityLocation,
  update,
  create,
  isEntity,
  isIdentityWithStatus,
  isEntityType,
  parseEntityLocation,
  createTimestamp
} from '@nodenogg.in/microcosm'
import type { Signed } from '@nodenogg.in/microcosm/crypto'
import { TelemetryError, collectTelemetryErrors } from '@nodenogg.in/microcosm/telemetry'
import { Manager, state } from '@figureland/kit/state'
import { settle } from '@figureland/kit/ts/async'
import { Doc, UndoManager, Map as YMap } from 'yjs'

import type { Persistence, PersistenceFactory } from './persistence'
import type { Provider, ProviderFactory } from './provider'
import type { YMicrocosmAPIOptions } from './YMicrocosmAPI'
import { isString } from '@figureland/kit/ts'
import { isObject } from '@figureland/kit/ts/guards'

export type SignedEntity = Signed<Entity>

export type YCollection = YMap<SignedEntity>

export class YMicrocosmDoc extends Manager {
  public readonly yDoc = new Doc()
  public readonly identities = this.yDoc.getMap<boolean>('identities')
  public readonly state = state({
    identities: [] as IdentityWithStatus[],
    persisted: false,
    connected: false
  })

  private persistence!: Persistence[]
  private providers!: Provider[]
  private identity_id!: IdentityID
  private undoManager: UndoManager
  private collection: YCollection
  private providerFactories?: ProviderFactory[]
  private persistenceFactories?: PersistenceFactory[]
  private config: MicrocosmAPIConfig

  constructor({ config, providers, persistence }: YMicrocosmAPIOptions) {
    super()
    this.config = structuredClone(config)
    this.providerFactories = providers
    this.persistenceFactories = persistence
  }

  public init = async () => {
    await this.createPersistences()
    await this.createProviders()
  }

  public identify = async (identity_id: IdentityID) => {
    if (!this.identity_id || this.identity_id !== identity_id) {
      this.identity_id = identity_id
      this.undoManager?.destroy()
      this.collection = this.getYCollection(this.identity_id)
      this.undoManager = new UndoManager(this.collection)
      this.identities.set(this.identity_id, true)
    }
  }

  private sign = async (entity: Entity): Promise<Signed<Entity>> => {
    return {
      data: entity,
      signature: ''
    }
  }

  private validate = async (e: unknown): Promise<Entity> => {
    if (!isObject(e) || !('data' in e) || !e || !isEntity(e?.data)) {
      throw new Error('Invalid signed entity')
    }
    return e.data
  }

  public getEntity = async <T extends EntityType>(
    entityLocation: { identity_id: IdentityID; entity_id: EntityID } | EntityLocation,
    type?: T
  ): Promise<Entity<T> | undefined> => {
    try {
      const parsed = isString(entityLocation) ? parseEntityLocation(entityLocation) : entityLocation

      if (!parsed) {
        throw new Error('Invalid entity location')
      }
      const collection = this.getYCollection(parsed.identity_id)
      const entity = collection?.get(parsed.entity_id)

      const data = await this.validate(entity)

      if (type) {
        if (!isEntityType(data, type)) {
          return undefined
        }
      }
      return data as Entity<T>
    } catch {
      return undefined
    }
  }

  public getYCollection = (identity_id: IdentityID): YCollection =>
    this.yDoc.getMap<SignedEntity>(identity_id)

  /**
   * Updates a single {@link Entity}
   */
  public update = async (entity_id: EntityID, u: UpdateEntityPayload) => {
    try {
      if (!this.collection) {
        throw new TelemetryError({
          level: 'warn',
          message: 'No identity available for microcosm operations',
          name: 'YMicrocosmAPI'
        })
      }
      const target = await this.getEntity({
        identity_id: this.identity_id,
        entity_id
      })
      if (target) {
        const payload = await this.sign(await update(target, u))
        this.collection.set(entity_id, payload)
      }
    } catch (error) {
      throw new TelemetryError({
        level: 'warn',
        message: `Could not update entity ${entity_id}`,
        name: 'YMicrocosmAPI',
        error
      })
    }
  }

  public create: CreateEntity = async (newEntity) => {
    try {
      if (!this.collection) {
        throw new TelemetryError({
          level: 'warn',
          message: 'No identity available for microcosm operations',
          name: 'YMicrocosmAPI'
        })
      }

      const payload = await this.sign(create(newEntity))
      this.collection.set(payload.data.id, payload)
      return payload.data
    } catch (error) {
      throw new TelemetryError({
        level: 'warn',
        message: `Could not create entity ${JSON.stringify(newEntity)}`,
        name: 'YMicrocosmAPI',
        error
      })
    }
  }

  public delete = async (entity_id: EntityID) => {
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
    this.destroyPersistence()
    this.destroyProviders()
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
      const { fulfilled, rejected } = await settle(
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
      const { fulfilled, rejected } = await settle(this.providerFactories.map(this.createProvider))

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
    this.disconnectProviders().then(() => {
      this.providers?.forEach((p) => p.destroy())
    })
  }

  private destroyPersistence = () => {
    this.persistence?.forEach((p) => p.destroy())
  }

  public get provider(): Provider | undefined {
    return this.providers ? this.providers[0] : undefined
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

    const states = Array.from(this.provider.awareness.getStates())
      .map(([, state]) => state?.identity || {})
      .filter(isIdentityWithStatus)

    this.state.set({
      identities: filterByIdentityID(states)
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
      timestamp: createTimestamp(),
      joined: true
    } as IdentityWithStatus)
  }

  public leave = (identity: Identity) => {
    this.provider?.awareness.setLocalStateField('identity', {
      ...identity,
      timestamp: createTimestamp(),
      joined: false
    } as IdentityWithStatus)
  }
}

const filterByIdentityID = (array: IdentityWithStatus[]): IdentityWithStatus[] => {
  const uniqueMap = new Map<IdentityID, IdentityWithStatus>()

  array.forEach((item) => {
    const existingItem = uniqueMap.get(item.identityID)
    if (!existingItem || item.timestamp > existingItem.timestamp) {
      uniqueMap.set(item.identityID, item)
    }
  })

  return Array.from(uniqueMap.values())
}
