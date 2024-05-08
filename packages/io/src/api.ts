import type { Entity, EntityType } from '@nodenogg.in/microcosm'

export type ParsedEntity<T extends EntityType = EntityType> = Partial<Entity<T>> & { type: T }

export type FileParser<E> = (file: string) => Promise<E>

export type Serializer = (file: Entity) => Promise<string>
