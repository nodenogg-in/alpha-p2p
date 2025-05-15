import { describe, it, expect } from 'vitest'
import entity, { type Entity } from '../entity.schema'
import { createEntityUUID, isValidEntityUUID } from '../entity.schema'

describe('entity', () => {
  describe('isValidEntityUUID', () => {
    it('should validate correct entity UUIDs', () => {
      const validID = 'ebt4nhr27z8198jp6'
      expect(isValidEntityUUID(validID)).toBe(true)
    })

    it('should reject invalid entity UUIDs', () => {
      expect(isValidEntityUUID('invalid')).toBe(false)
      expect(isValidEntityUUID('e123')).toBe(false)
      expect(isValidEntityUUID('e123456!')).toBe(false)
      expect(isValidEntityUUID(123)).toBe(false)
      expect(isValidEntityUUID(null)).toBe(false)
      expect(isValidEntityUUID('a12345678')).toBe(false)
    })
  })

  describe('createEntityID', () => {
    it('should create valid entity UUID with prefix', () => {
      const id = createEntityUUID()
      expect(isValidEntityUUID(id)).toBe(true)
      expect(id.startsWith('e')).toBe(true)
      expect(id.length).toBe(17)
    })
  })

  describe('entity schema', () => {
    const validEntityV1: Entity = {
      uuid: 'eexaji9ebltqb6i58',
      lastEdited: 1234567890,
      created: 1234567890,
      version: '1',
      data: {
        type: 'html',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        backgroundColor: '#ffffff',
        content: 'test content'
      }
    }

    it('should validate correct entity object', () => {
      const result = entity.schema.validate(validEntityV1)
      expect(result).toBe(true)
    })

    it('should reject invalid entity objects', () => {
      const invalidEntities = [
        { uuid: 'invalid' },
        { uuid: 'e12345678', type: 'invalid' },
        {
          ...validEntityV1,
          lastEdited: 'invalid'
        },
        {
          ...validEntityV1,
          data: { ...validEntityV1.data, x: '100' }
        },
        {
          ...validEntityV1,
          data: {
            backgroundColor: 123
          }
        }
      ]

      invalidEntities.forEach((invalid) => {
        expect(() => entity.schema.parse(invalid)).toThrow()
      })
    })
  })

  describe('create', () => {
    it('should create a valid entity with partial data', () => {
      const partial = {
        type: 'html',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        content: ''
      }

      const result = entity.create(partial as Entity['data'])

      expect(isValidEntityUUID(result.uuid)).toBe(true)
      expect(entity.isEntityType(result, 'html')).toBe(true)

      expect(result.lastEdited).toBeTypeOf('number')
      expect(result.created).toBeTypeOf('number')

      if (entity.isEntityType(result, 'html')) {
        expect(result.data.x).toBe(partial.x)
        expect(result.data.y).toBe(partial.y)
        expect(result.data.width).toBe(partial.width)
        expect(result.data.height).toBe(partial.height)
      }
    })

    it('should reject a new entity with missing data', () => {
      // @ts-expect-error - Testing with incomplete data
      expect(() => entity.create({ type: 'html' })).toThrow()
    })

    it('should create a valid entity with all data', () => {
      const result = entity.create({
        type: 'html',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        content: 'test content',
        backgroundColor: '#ffffff'
      })

      expect(entity.isEntityType(result, 'html')).toBe(true)

      if (entity.isEntityType(result, 'html')) {
        expect(result.data.x).toBe(100)
        expect(result.data.y).toBe(200)
        expect(result.data.width).toBe(300)
        expect(result.data.height).toBe(400)
        expect(result.data.content).toBe('test content')
        expect(result.data.backgroundColor).toBe('#ffffff')
      }
    })
  })

  describe('patch', () => {
    it('should patch an existing entity with partial data', async () => {
      const original = entity.create({
        type: 'html',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        content: 'original content',
        backgroundColor: '#ffffff'
      })

      const patchData = {
        x: 150,
        y: 250,
        content: 'new content',
        backgroundColor: '#000000'
      }

      await new Promise((resolve) => setTimeout(resolve, 10))

      const result = entity.patch(original, patchData)

      expect(result.uuid).toBe(original.uuid)
      expect(result.data.type).toBe('html')
      expect(result.created).toBe(original.created)
      expect(result.lastEdited).toBeGreaterThan(original.lastEdited)

      if (entity.isEntityType(result, 'html') && entity.isEntityType(original, 'html')) {
        expect(result.data.x).toBe(patchData.x)
        expect(result.data.y).toBe(patchData.y)
        expect(result.data.width).toBe(original.data.width)
        expect(result.data.height).toBe(original.data.height)
        expect(result.data.content).toBe(patchData.content)
        expect(result.data.backgroundColor).toBe(patchData.backgroundColor)
      }
    })

    it('should maintain unchanged properties', () => {
      const original = entity.create({
        type: 'html',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        content: 'original content',
        backgroundColor: '#ffffff'
      })

      const result = entity.patch(original, { x: 150 })

      if (entity.isEntityType(result, 'html') && entity.isEntityType(original, 'html')) {
        expect(result.data.x).toBe(150)
        expect(result.data.y).toBe(original.data.y)
        expect(result.data.width).toBe(original.data.width)
        expect(result.data.height).toBe(original.data.height)
        expect(result.data.content).toBe(original.data.content)
        expect(result.data.backgroundColor).toBe(original.data.backgroundColor)
      }
    })
  })

  describe('isEntityType', () => {
    it('should correctly identify html entities', () => {
      const htmlEntity = entity.create({
        type: 'html',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        content: 'test content'
      })

      expect(entity.isEntityType(htmlEntity, 'html')).toBe(true)
      expect(entity.isEntityType(htmlEntity, 'connection')).toBe(false)
    })

    it('should correctly identify connection entities', () => {
      const fromId = createEntityUUID()
      const toId = createEntityUUID()
      const connectionEntity = entity.create({
        type: 'connection',
        from: fromId,
        to: toId
      })

      expect(entity.isEntityType(connectionEntity, 'connection')).toBe(true)
      expect(entity.isEntityType(connectionEntity, 'html')).toBe(false)
    })

    it('should reject invalid entities', () => {
      const invalidEntity = {
        uuid: 'invalid',
        lastEdited: 1234567890,
        created: 1234567890,
        version: '1',
        data: {
          type: 'html',
          x: 100
        }
      }

      expect(entity.isEntityType(invalidEntity, 'html')).toBe(false)
      expect(entity.isEntityType(invalidEntity, 'connection')).toBe(false)
    })
  })

  describe('connection variant', () => {
    it('should create a valid connection entity with optional fields', () => {
      const fromId = createEntityUUID()
      const toId = createEntityUUID()

      // Test with both fields
      const result1 = entity.create({
        type: 'connection',
        from: fromId,
        to: toId
      })
      expect(entity.isEntityType(result1, 'connection')).toBe(true)
      if (entity.isEntityType(result1, 'connection')) {
        expect(result1.data.from).toBe(fromId)
        expect(result1.data.to).toBe(toId)
      }

      // Test with only from field
      const result2 = entity.create({
        type: 'connection',
        from: fromId
      })
      expect(entity.isEntityType(result2, 'connection')).toBe(true)
      if (entity.isEntityType(result2, 'connection')) {
        expect(result2.data.from).toBe(fromId)
        expect(result2.data.to).toBeUndefined()
      }

      // Test with only to field
      const result3 = entity.create({
        type: 'connection',
        to: toId
      })
      expect(entity.isEntityType(result3, 'connection')).toBe(true)
      if (entity.isEntityType(result3, 'connection')) {
        expect(result3.data.from).toBeUndefined()
        expect(result3.data.to).toBe(toId)
      }

      // Test with no fields
      const result4 = entity.create({
        type: 'connection'
      })
      expect(entity.isEntityType(result4, 'connection')).toBe(true)
      if (entity.isEntityType(result4, 'connection')) {
        expect(result4.data.from).toBeUndefined()
        expect(result4.data.to).toBeUndefined()
      }
    })

    it('should reject invalid connection entities', () => {
      const invalidConnections = [
        {
          type: 'connection',
          from: 'invalid-id',
          to: createEntityUUID()
        },
        {
          type: 'connection',
          from: createEntityUUID(),
          to: 'invalid-id'
        },
        {
          type: 'connection',
          from: 'invalid-id',
          to: 'invalid-id'
        }
      ]

      invalidConnections.forEach((invalid) => {
        // @ts-expect-error - Testing invalid data
        expect(() => entity.create(invalid)).toThrow()
      })
    })

    it('should patch a connection entity', () => {
      const fromId = createEntityUUID()
      const toId = createEntityUUID()
      const newToId = createEntityUUID()

      const original = entity.create({
        type: 'connection',
        from: fromId,
        to: toId
      })

      const result = entity.patch(original, { to: newToId })

      expect(entity.isEntityType(result, 'connection')).toBe(true)

      if (entity.isEntityType(result, 'connection')) {
        expect(result.data.from).toBe(fromId)
        expect(result.data.to).toBe(newToId)
      }
    })
  })
})
