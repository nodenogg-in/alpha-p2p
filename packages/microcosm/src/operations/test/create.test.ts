import { describe, expect, it } from 'vitest'
import { create } from '../../operations/create'
import { isEntityType } from '../../guards/entity-guards'
import { createEntityID, isValidEntityID } from '../..'

describe('Entity operations', () => {
  describe('create function', () => {
    it('should correctly initialize a new HTML entity', () => {
      const entity = create({
        type: 'html',
        body: '<p>Hello World</p>',
        x: 10,
        y: 20,
        width: 100,
        height: 200,
        background_color: 'white'
      })

      expect(isEntityType(entity, 'html')).toBeTruthy()
      expect(entity.id).toBeTruthy()
      expect(entity.type).toBe('html')
      expect(entity.created).not.toBeNaN()
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).not.toBeNaN()
    })

    it('should correctly initialize a new emoji entity', () => {
      const entity = create({
        type: 'emoji',
        body: 'e',
        entity_id: 'eid'
      })

      expect(isEntityType(entity, 'emoji')).toBeTruthy()
      expect(entity.id).toBeTruthy()
      expect(entity.type).toBe('emoji')
      expect(entity.created).not.toBeNaN()
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).not.toBeNaN()
    })

    it('should correctly initialize a new region entity', () => {
      const entity = create({
        type: 'region',
        x: 10,
        y: 20,
        width: 100,
        height: 200
      })

      expect(isEntityType(entity, 'region')).toBeTruthy()
      expect(entity.id).toBeTruthy()
      expect(entity.type).toBe('region')
      expect(entity.created).not.toBeNaN()
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).not.toBeNaN()
    })

    it('should correctly initialize a new ghost entity', () => {
      const entity = create({
        type: 'ghost',
        x: 10,
        y: 20,
        width: 100,
        height: 200,
        deleted: 0
      })

      expect(isEntityType(entity, 'ghost')).toBeTruthy()
      expect(entity.id).toBeTruthy()
      expect(entity.type).toBe('ghost')
      expect(entity.created).not.toBeNaN()
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).not.toBeNaN()
    })

    it('should correctly initialize a new ghost entity', () => {
      const entity = create({
        type: 'connection',
        from: 'eid',
        to: 'eid2',
        body: ''
      })

      const validEntity = create({
        type: 'connection',
        from: createEntityID(),
        to: createEntityID(),
        body: ''
      })

      expect(isEntityType(entity, 'connection')).toBeTruthy()
      expect(isValidEntityID(entity.id)).toBeTruthy()
      expect(isValidEntityID(entity.from)).toBeFalsy()
      expect(isValidEntityID(entity.to)).toBeFalsy()
      expect(isValidEntityID(validEntity.from)).toBeTruthy()
      expect(isValidEntityID(validEntity.to)).toBeTruthy()
      expect(entity.type).toBe('connection')
      expect(entity.created).not.toBeNaN()
      expect(entity.lastEdited).not.toBeNaN()
      expect(entity.schema).not.toBeNaN()
    })
  })
})
