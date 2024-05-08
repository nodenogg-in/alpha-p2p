import { clone as c } from '@figureland/typekit/clone'
import { createEntityID, createTimestamp } from './uuid'
import type { Entity, EntityType } from '../schema/entity.schema'

export const clone = <T extends EntityType, E extends Entity<T>>(e: E): E => {
  const created = createTimestamp()
  return {
    ...c(e),
    id: createEntityID(),
    created,
    lastEdited: created
  }
}
