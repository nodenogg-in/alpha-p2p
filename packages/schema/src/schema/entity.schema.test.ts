import { describe, it, expect } from 'vitest'
import {
  htmlEntitySchema,
  isValidEntityUUID,
  createEntityUUID,
  create,
  HTMLEntity,
  patch
} from './entity.schema'

describe('entity schema', () => {
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
    const validEntityV1: HTMLEntity = {
      uuid: 'e12345678',
      type: 'html',
      lastEdited: 1234567890,
      created: 1234567890,
      x: 100,
      y: 200,
      width: 300,
      height: 400,
      backgroundColor: '#ffffff',
      content: 'test content',
      version: '1'
    }

    it('should validate correct entity object', () => {
      const result = htmlEntitySchema.parse(validEntityV1)
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
          x: '100'
        },
        {
          ...validEntityV1,
          backgroundColor: 123
        }
      ]

      invalidEntities.forEach((invalid) => {
        expect(() => htmlEntitySchema.parse(invalid)).toThrow()
      })
    })
  })

  describe('create', () => {
    it('should create a valid entity with partial data', () => {
      const partial = {
        x: 100,
        y: 200,
        width: 300,
        height: 400
      }

      const result = create(partial)

      expect(isValidEntityUUID(result.uuid)).toBe(true)
      expect(result.type).toBe('html')
      expect(result.lastEdited).toBeTypeOf('number')
      expect(result.created).toBeTypeOf('number')
      expect(result.x).toBe(partial.x)
      expect(result.y).toBe(partial.y)
      expect(result.width).toBe(partial.width)
      expect(result.height).toBe(partial.height)
    })

    it('should create a valid entity with minimal data', () => {
      const result = create()

      expect(isValidEntityUUID(result.uuid)).toBe(true)
      expect(result.type).toBe('html')
      expect(result.lastEdited).toBeTypeOf('number')
      expect(result.created).toBeTypeOf('number')
    })

    it('should create a valid entity with all data', () => {
      const result = create({
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        content: 'test content',
        backgroundColor: '#ffffff'
      })

      expect(result.x).toBe(100)
      expect(result.y).toBe(200)
      expect(result.width).toBe(300)
      expect(result.height).toBe(400)
      expect(result.content).toBe('test content')
      expect(result.backgroundColor).toBe('#ffffff')
    })
  })

  describe('patch', () => {
    it('should patch an existing entity with partial data', async () => {
      const original = create({
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

      const result = patch(original, patchData)

      expect(result.uuid).toBe(original.uuid)
      expect(result.type).toBe('html')
      expect(result.created).toBe(original.created)
      expect(result.lastEdited).toBeGreaterThan(original.lastEdited)
      expect(result.x).toBe(patchData.x)
      expect(result.y).toBe(patchData.y)
      expect(result.width).toBe(original.width)
      expect(result.height).toBe(original.height)
      expect(result.content).toBe(patchData.content)
      expect(result.backgroundColor).toBe(patchData.backgroundColor)
    })

    it('should maintain unchanged properties', () => {
      const original = create({
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        content: 'original content',
        backgroundColor: '#ffffff'
      })

      const result = patch(original, { x: 150 })

      expect(result.y).toBe(original.y)
      expect(result.width).toBe(original.width)
      expect(result.height).toBe(original.height)
      expect(result.content).toBe(original.content)
      expect(result.backgroundColor).toBe(original.backgroundColor)
    })
  })
})
