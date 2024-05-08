import { describe, it, expect } from 'vitest'
import { Entity, createEntityID, isAnyEntity, isEntity, isEntityType, isEntityVersion } from '../..'

const mockEntity: Entity<'html'> = {
  id: createEntityID(),
  type: 'html',
  lastEdited: 123456789,
  created: 123456789,
  schema: 1,
  x: 10,
  y: 20,
  width: 100,
  height: 200,
  body: 'Sample text',
  background_color: 'white'
}

const incompleteEntity = {
  id: createEntityID(),
  type: 'html',
  schema: 1
}

const wrongTypeEntity = {
  id: createEntityID(),
  type: 'nonexistentType',
  lastEdited: 123456789,
  created: 123456789,
  schema: 1,
  x: 10,
  y: 20,
  width: 100,
  height: 200
}

describe('Entity validation functions', () => {
  it('isEntity should verify node structure', () => {
    expect(isEntity(mockEntity)).toBe(true)
    expect(isEntity(incompleteEntity)).toBe(false)
    expect(isEntity(wrongTypeEntity)).toBe(false)
  })

  it('isEntityType should verify node type', () => {
    expect(isEntityType(mockEntity, 'html')).toBe(true)
    expect(isEntityType(mockEntity, 'region')).toBe(false)
    expect(isEntityType(wrongTypeEntity, 'nonexistentType')).toBe(false)
    expect(isAnyEntity(wrongTypeEntity)).toBe(true)
    expect(isEntity(wrongTypeEntity)).toBe(false)
  })

  it('isEntityVersion should verify schema version', () => {
    expect(isEntityVersion(mockEntity, 1)).toBe(true)
    expect(isEntityVersion(mockEntity, 2)).toBe(false)
    expect(isEntityVersion(mockEntity, 1, 'html')).toBe(true)
    expect(isEntityVersion(mockEntity, 1, 'emoji')).toBe(false)
    expect(isEntityVersion(incompleteEntity, 1)).toBe(false)
  })
})
