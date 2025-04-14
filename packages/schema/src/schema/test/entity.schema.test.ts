import { describe, it, expect } from 'vitest'
import entity, { type Entity } from '../entity.schema'
import { createEntityUUID, isValidEntityUUID } from '../entity.schema'

describe('html entity schema', () => {
  describe('isValidEntityUUID', () => {
    it('should validate correct entity UUIDs', () => {
      const validID = 'e12345678'
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
      expect(id.length).toBe(9)
    })
  })

  describe('htmlEntitySchema', () => {
    const validEntityV1: Entity = {
      uuid: 'e12345678',
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
      const result = entity.schema.parse(validEntityV1)
      expect(result).toEqual(validEntityV1)
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
        height: 400
      }

      const result = entity.create(partial as Entity['data'])

      expect(isValidEntityUUID(result.uuid)).toBe(true)
      expect(result.data.type).toBe('html')
      expect(result.lastEdited).toBeTypeOf('number')
      expect(result.created).toBeTypeOf('number')
      expect(result.data.x).toBe(partial.x)
      expect(result.data.y).toBe(partial.y)
      expect(result.data.width).toBe(partial.width)
      expect(result.data.height).toBe(partial.height)
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

      expect(result.data.x).toBe(100)
      expect(result.data.y).toBe(200)
      expect(result.data.width).toBe(300)
      expect(result.data.height).toBe(400)
      expect(result.data.content).toBe('test content')
      expect(result.data.backgroundColor).toBe('#ffffff')
    })
  })

  describe('patch', () => {
    it('should patch an existing entity with partial data', async () => {
      const original = entity.create({
        type: 'html',
        x: 100,
        y: 200,
        width: 300,
        height: 400
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
      expect(result.data.x).toBe(patchData.x)
      expect(result.data.y).toBe(patchData.y)
      expect(result.data.width).toBe(original.data.width)
      expect(result.data.height).toBe(original.data.height)
      expect(result.data.content).toBe(patchData.content)
      expect(result.data.backgroundColor).toBe(patchData.backgroundColor)
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

      expect(result.data.x).toBe(150)
      expect(result.data.y).toBe(original.data.y)
      expect(result.data.width).toBe(original.data.width)
      expect(result.data.height).toBe(original.data.height)
      expect(result.data.content).toBe(original.data.content)
      expect(result.data.backgroundColor).toBe(original.data.backgroundColor)
    })
  })
})
