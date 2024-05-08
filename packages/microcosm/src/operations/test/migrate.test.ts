import { describe, expect, it } from 'vitest'
import { createMigration } from '../migrate'
import { createEntityID } from '../uuid'
import type { Entity } from '../../schema/entity.schema'
import { isEntityVersion } from '../../guards/entity-guards'
import { isValidEntityID } from '../..'

describe('Entity operations', () => {
  describe('createEntityMigration function', () => {
    it('should apply migration correctly', () => {
      const oldEntity: Entity<'emoji'> = {
        type: 'emoji',
        schema: 1,
        id: createEntityID(),
        created: 123,
        lastEdited: 123,
        body: 'E'
      }

      const migrate = createMigration('emoji', [1, 2], {
        add: () => ({
          entity_id: createEntityID()
        }),
        remove: []
      })

      expect(isEntityVersion(oldEntity, 2)).toBeFalsy()
      expect(isEntityVersion(oldEntity, 1)).toBeTruthy()

      const newEntity = migrate(oldEntity)

      expect(newEntity.schema).toBe(2)
      expect(isEntityVersion(newEntity, 2)).toBeTruthy()
      expect(isEntityVersion(newEntity, 2, 'emoji')).toBeTruthy()
      expect(isValidEntityID(newEntity.entity_id)).toBeTruthy()
    })
  })
})
