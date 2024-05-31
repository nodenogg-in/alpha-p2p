import { describe, expect, it } from 'vitest'
import { update } from '../../operations/update'
import { createEntityID, isEntityType, isValidEntityID, type Entity } from '../..'

describe('Entity operations', () => {
  describe('update function', () => {
    it('should update entity properties and adjust lastEdited time', async () => {
      const editTime = 1234500000
      const existingEntity: Entity<'html'> = {
        type: 'html',
        id: createEntityID(),
        schema: 1,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }

      const updates = {
        body: '<p>Updated Content</p>'
      }

      const updatedEntity = await update(existingEntity, updates)

      expect(updatedEntity.body).toBe('<p>Updated Content</p>')
      expect(updatedEntity.lastEdited).not.toBe(editTime)
    })

    it('should update entity position and size', async () => {
      const editTime = 1234500000
      const existingEntity: Entity<'html'> = {
        type: 'html',
        id: createEntityID(),
        schema: 1,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }

      const updates = {
        body: '<p>Updated Content</p>',
        x: -100,
        y: 300.0001,
        width: 1000,
        height: 2000
      }

      const updatedEntity = await update(existingEntity, updates)

      expect(updatedEntity.body).toBe('<p>Updated Content</p>')
      expect(updatedEntity.x).toBe(-100)
      expect(updatedEntity.y).toBe(300.0001)
      expect(updatedEntity.width).toBe(1000)
      expect(updatedEntity.height).toBe(2000)
      expect(updatedEntity.lastEdited).not.toBe(editTime)
    })

    it('should omit readonly props from update', async () => {
      const editTime = 1234500000
      const existingEntity: Entity<'html'> = {
        type: 'html',
        id: createEntityID(),
        schema: 1,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }

      const updates = {
        type: 'emoji',
        id: 'broken id'
      }

      //@ts-expect-error
      const updatedEntity = await update(existingEntity, updates)

      expect(updatedEntity.type).toBe('html')
      expect(updatedEntity.lastEdited).toBe(editTime)
    })

    it('should not omit readonly props from update but allow through valid updates', async () => {
      const editTime = 1234500000
      const currentEntityId = createEntityID()
      const existingEntity: Entity<'html'> = {
        type: 'html',
        id: currentEntityId,
        schema: 1,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }

      const updates = {
        type: 'emoji',
        id: 'broken id',
        x: 10
      }

      const updatedEntity = await update(existingEntity, updates)

      expect(updatedEntity.type).toBe('html')
      expect(updatedEntity.x).toBe(10)
      expect(updatedEntity.id).toBe(currentEntityId)
      expect(isEntityType(updatedEntity, 'html')).toBeTruthy()
      expect(updatedEntity.lastEdited).not.toBe(editTime)
    })

    it('should update entity properties and adjust lastEdited time', async () => {
      const editTime = 1234500000
      const existingEntity: Entity<'emoji'> = {
        type: 'emoji',
        id: createEntityID(),
        schema: 2,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        entity_id: 'eid1'
      }

      const updates = {
        body: 'X'
      }

      const updatedEntity = await update(existingEntity, updates)
      expect(isEntityType(updatedEntity, 'emoji')).toBeTruthy()
      expect(updatedEntity.body).toBe('X')
      expect(isValidEntityID(updatedEntity.entity_id)).toBeFalsy()
      expect(updatedEntity.lastEdited).not.toBe(editTime)
    })
  })
})
