import { isEntityType } from '../guards/entity-guards'
import type { Entity, EntityType } from '../schema/entity.schema'

export const getEntitiesByType = <T extends EntityType | undefined = undefined>(
  entities: Entity[],
  type?: T
) => {
  if (!type) {
    return entities as T extends undefined ? Entity[] : never
  } else {
    return entities.filter((entity: Entity) => isEntityType(entity[1], type)) as Entity<
      typeof type
    >[]
  }
}
