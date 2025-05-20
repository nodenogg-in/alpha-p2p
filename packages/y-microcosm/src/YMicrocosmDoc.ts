import { state } from '@figureland/kit/state'
import { settle } from '@figureland/kit/tools/async'
import { Doc, UndoManager, Map as YMap } from 'yjs'

import type { Persistence, PersistenceFactory } from './persistence'
import type { Provider, ProviderFactory } from './provider'
import { isString } from '@figureland/kit/tools'

import {
  Entity,
  Identity,
  MicrocosmAPIConfig,
  IdentityUUID,
  NNError,
  collectNNErrors,
  EntityLocation,
  entity,
  identity
} from '@nodenogg.in/core'
import { createTimestamp } from '@figureland/kit/tools/time'
import { YMicrocosmAPIOptions } from '.'

export type Signed<T> = {
  content: T
  signature: string
}

export type SignedEntity = Signed<Entity>

export type YCollection = YMap<SignedEntity>

export class YMicrocosmDoc {
  public readonly yDoc = new Doc()
  public readonly identities = this.yDoc.getMap<boolean>('identities')
  public readonly state = state({
    identities: [] as Identity[],
    persisted: false,
    connected: false
  })

  private persistence!: Persistence[]
  private providers!: Provider[]
  private identity_id!: IdentityUUID
  private undoStore: UndoManager
  private collection: YCollection
  private providerFactories?: ProviderFactory[]
  private persistenceFactories?: PersistenceFactory[]
  private config: MicrocosmAPIConfig

  constructor({ config, providers, persistence }: YMicrocosmAPIOptions) {
    this.config = structuredClone(config)
    this.providerFactories = providers
    this.persistenceFactories = persistence
  }

  public init = async () => {
    await this.createPersistences()
    await this.createProviders()
  }

  public identify = async (identity_id: IdentityUUID) => {
    if (!this.identity_id || this.identity_id !== identity_id) {
      this.identity_id = identity_id
      this.undoStore?.destroy()
      this.collection = this.getYCollection(this.identity_id)
      this.undoStore = new UndoManager(this.collection)
      this.identities.set(this.identity_id, true)
    }
  }

  private sign = async (entity: Entity): Promise<Signed<Entity>> => {
    return {
      content: entity,
      signature: ''
    }
  }

  public getEntity = async (
    entityLocation: { identity_id: IdentityUUID; entity_id: string } | EntityLocation
  ): Promise<Entity | undefined> => {
    try {
      const parsed = isString(entityLocation)
        ? entity.parseEntityLocation(entityLocation)
        : entityLocation

      if (!parsed) {
        throw new Error('Invalid entity location')
      }

      const collection = this.getYCollection(parsed.identity_id)
      const e = collection?.get(parsed.entity_id)
      return entity.schema.parse(e?.content)
    } catch {
      return undefined
    }
  }

  public getYCollection = (identity_id: IdentityUUID): YCollection =>
    this.yDoc.getMap<SignedEntity>(identity_id)

  /**
   * Updates a single {@link Entity}
   */
  public update = async (entity_id: string, u: Partial<Omit<Entity['data'], 'type'>>) => {
    try {
      if (!this.collection) {
        throw new NNError({
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
        const payload = await this.sign(entity.update(target, u))
        this.collection.set(entity_id, payload)
        return payload.content
      }
    } catch (error) {
      throw new NNError({
        level: 'warn',
        message: `Could not update entity ${entity_id}`,
        name: 'YMicrocosmAPI',
        error
      })
    }
  }

  public create = async (data: Entity['data']) => {
    try {
      if (!this.collection) {
        throw new NNError({
          level: 'warn',
          message: 'No identity available for microcosm operations',
          name: 'YMicrocosmAPI'
        })
      }
      const payload = await this.sign(entity.create(data))
      this.collection.set(payload.content.uuid, payload)
      return payload.content
    } catch (error) {
      throw new NNError({
        level: 'warn',
        message: `Could not create entity ${JSON.stringify(data)}`,
        name: 'YMicrocosmAPI',
        error
      })
    }
  }

  public delete = async (entity_id: string) => {
    if (!this.collection) {
      throw new NNError({
        level: 'warn',
        message: 'No identity available for microcosm operations',
        name: 'YMicrocosmAPI'
      })
    }
    this.collection?.delete(entity_id)
  }

  public undo = () => {
    this.undoStore?.undo()
  }

  public redo = () => {
    this.undoStore?.redo()
  }

  public dispose = () => {
    this.destroyPersistence()
    this.destroyProviders()
    this.yDoc.destroy()
    this.undoStore?.destroy()
  }

  private createPersistence = async (createPersistenceFn: PersistenceFactory) => {
    const { microcosmUUID } = this.config
    try {
      const persistence = await createPersistenceFn(microcosmUUID, this.yDoc)
      return persistence
    } catch (error) {
      throw new NNError({
        name: 'YMicrocosmDoc',
        message: `Could not create persistence for ${microcosmUUID}`,
        level: 'fail',
        error
      })
    }
  }

  private createProvider = async (createProviderFn: ProviderFactory) => {
    const { microcosmUUID, password } = this.config

    try {
      const provider = await createProviderFn(microcosmUUID, this.yDoc, password)
      return provider
    } catch (error) {
      throw new NNError({
        name: 'YMicrocosmDoc',
        message: `Could not create provider for ${microcosmUUID}`,
        level: 'warn',
        error
      })
    }
  }

  private createPersistences = async () => {
    try {
      if (!this.persistenceFactories) {
        throw new NNError({
          name: 'YMicrocosmDoc',
          message: `No persistence methods available`,
          level: 'warn'
        })
      }
      const { fulfilled, rejected } = await settle(
        this.persistenceFactories.map(this.createPersistence)
      )

      if (fulfilled.length === 0) {
        const reasons = collectNNErrors(rejected)

        throw new NNError({
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
        throw new NNError({
          name: 'YMicrocosmDoc',
          message: `No providers available`,
          level: 'warn'
        })
      }
      const { fulfilled, rejected } = await settle(this.providerFactories.map(this.createProvider))

      if (fulfilled.length === 0) {
        const reasons = collectNNErrors(rejected)

        throw new NNError({
          name: 'YMicrocosmAPI',
          level: 'warn',
          message: `No providers available (${rejected.length}/${this.providerFactories.length} failed: ${reasons.join(', ')})`
        })
      }

      this.providers = fulfilled

      this.provider?.awareness?.on('change', this.handleAwareness)
      this.provider?.awareness?.on('update', this.handleAwareness)

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
    this.provider?.awareness?.off('change', this.handleAwareness)
    this.provider?.awareness?.off('update', this.handleAwareness)
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

    const states = Array.from(this.provider?.awareness?.getStates() || new Map())
      .map(([, state]) => state?.identity || {})
      .filter(identity.schema.validate)

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
    this.provider?.awareness?.setLocalStateField('identity', {
      ...identity,
      timestamp: createTimestamp(),
      joined: true
    } as Identity)
  }

  public leave = (identity: Identity) => {
    this.provider?.awareness?.setLocalStateField('identity', {
      ...identity,
      timestamp: createTimestamp(),
      joined: false
    } as Identity)
  }
}

const filterByIdentityID = (array: Identity[]): Identity[] => {
  const uniqueMap = new Map<IdentityUUID, Identity>()

  array.forEach((item) => {
    //   const existingItem = uniqueMap.get(item.uuid)
    //   if (!existingItem || item.timestamp > existingItem.timestamp) {
    uniqueMap.set(item.uuid, item)
    //   }
  })

  return Array.from(uniqueMap.values())
}
