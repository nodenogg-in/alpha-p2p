import { describe, expect, it } from 'vitest'
import { fromPartial } from '../../operations/partial'
import { create, isEntity, isEntityType } from '../..'
import { latestEntitySchemaVersions } from '../../schema/entity.schema'

describe('Entity operations', () => {
  describe('create function', () => {
    it('should correctly initialize a new HTML entity', () => {
      const entity = create(
        fromPartial({
          type: 'html'
        })
      )

      expect(isEntityType(entity, 'html')).toBeTruthy()
      expect(entity.id).toBeTruthy()
      expect(entity.type).toBe('html')
      expect(entity.created).not.toBeNaN()
      expect(entity.x).toBe(0)
      expect(entity.y).toBe(0)
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).toBe(latestEntitySchemaVersions.html)
    })

    it('should correctly initialize a new emoji entity', () => {
      const entity = create(
        fromPartial({
          type: 'emoji'
        })
      )

      expect(isEntityType(entity, 'emoji')).toBeTruthy()
      expect(entity.id).toBeTruthy()
      expect(entity.type).toBe('emoji')
      expect(entity.created).not.toBeNaN()
      expect(entity.body).toBe('')
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).not.toBeNaN()
      expect(entity.schema).toBe(latestEntitySchemaVersions.emoji)
      expect(isEntity(entity)).toBeTruthy()
    })

    it('should correctly initialize a new connection entity', () => {
      const entity = create(
        fromPartial({
          type: 'connection'
        })
      )

      expect(isEntityType(entity, 'connection')).toBeTruthy()
      expect(entity.id).toBeTruthy()
      expect(entity.type).toBe('connection')
      expect(entity.created).not.toBeNaN()
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).not.toBeNaN()
      expect(entity.schema).toBe(latestEntitySchemaVersions.connection)
      expect(isEntity(entity)).toBeTruthy()
    })

    it('should correctly initialize a new ghost entity', () => {
      const entity = create(
        fromPartial({
          type: 'ghost'
        })
      )

      expect(isEntityType(entity, 'ghost')).toBeTruthy()
      expect(entity.id).toBeTruthy()
      expect(entity.type).toBe('ghost')
      expect(entity.created).not.toBeNaN()
      expect(entity.x).toBe(0)
      expect(entity.y).toBe(0)
      expect(entity.width).toBe(0)
      expect(entity.height).toBe(0)
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).toBe(latestEntitySchemaVersions.ghost)
      expect(isEntity(entity)).toBeTruthy()
    })

    it('should correctly initialize a new region entity', () => {
      const entity = create(
        fromPartial({
          type: 'region'
        })
      )

      expect(isEntityType(entity, 'region')).toBeTruthy()
      expect(entity.id).toBeTruthy()
      expect(entity.type).toBe('region')
      expect(entity.created).not.toBeNaN()
      expect(entity.x).toBe(0)
      expect(entity.y).toBe(0)
      expect(entity.width).toBe(0)
      expect(entity.height).toBe(0)
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).toBe(latestEntitySchemaVersions.region)
      expect(isEntity(entity)).toBeTruthy()
    })
  })
})
