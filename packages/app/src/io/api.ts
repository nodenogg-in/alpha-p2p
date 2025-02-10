import { Entity, EntityType } from '../schema/entity.schema'

export type ParsedEntity<T extends EntityType = EntityType> = Partial<Entity<T>> & { type: T }

export type FileParser<E> = (file: string) => Promise<E>

export type Serializer = (file: Entity) => Promise<string>
