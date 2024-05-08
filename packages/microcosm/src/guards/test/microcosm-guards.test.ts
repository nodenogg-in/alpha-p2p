import { describe, it, expect } from 'vitest'
import { isSerializedCollection, isSerializedMicrocosm } from '../microcosm-guards'
import { createIdentityID, createEntityID } from '../../operations/uuid'
import { SerializedCollection, SerializedMicrocosm } from '../..'

const mockEntity = {
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

const collection: SerializedCollection = {}

const microcosm: SerializedMicrocosm = {
  [createIdentityID()]: collection
}

const brokenMicrocosm = {
  identity: {}
}

describe('Microcosm and collection validation functions', () => {
  it('isSerializedCollection should verify collection structure', () => {
    const entityID = createEntityID()
    const collection = { [entityID]: mockEntity }
    const invalidCollection = { [entityID]: { ...mockEntity, id: undefined } }
    const mixedCollection = { [entityID]: mockEntity, invalid: incompleteEntity }
    expect(isSerializedCollection(collection)).toBe(true)
    expect(isSerializedCollection(invalidCollection)).toBe(false)
    expect(isSerializedCollection(mixedCollection)).toBe(false)
  })

  it('isSerializedMicrocosm should verify microcosm structure', () => {
    expect(isSerializedMicrocosm(microcosm)).toBe(true)
    expect(isSerializedMicrocosm(brokenMicrocosm)).toBe(false)
  })
})
