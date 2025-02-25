import { describe, it, expect } from 'vitest'
import {
  htmlEntitySchema,
  isValidEntityUUID,
  createEntityUUID,
  create,
  HTMLEntity
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
      const result = create({})

      expect(isValidEntityUUID(result.uuid)).toBe(true)
      expect(result.type).toBe('html')
      expect(result.lastEdited).toBeTypeOf('number')
      expect(result.created).toBeTypeOf('number')
    })
  })
})
