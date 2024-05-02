import { describe, it, expect } from 'vitest'
import { isSerializedCollection, isSerializedMicrocosm } from '../microcosm-guards'
import { createIdentityID, createNodeID } from '../../operations/uuid'

const mockNode = {
  id: createNodeID(),
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

const incompleteNode = {
  id: createNodeID(),
  type: 'html',
  schema: 1
}

const wrongTypeNode = {
  id: createNodeID(),
  type: 'nonexistentType',
  lastEdited: 123456789,
  created: 123456789,
  schema: 1,
  x: 10,
  y: 20,
  width: 100,
  height: 200
}

describe('Microcosm and collection validation functions', () => {
  it('isSerializedCollection should verify collection structure', () => {
    const nodeID = createNodeID()
    const collection = { [nodeID]: mockNode }
    const invalidCollection = { [nodeID]: { ...mockNode, id: undefined } }
    const mixedCollection = { [nodeID]: mockNode, invalid: incompleteNode }
    expect(isSerializedCollection(collection)).toBe(true)
    expect(isSerializedCollection(invalidCollection)).toBe(false)
    expect(isSerializedCollection(mixedCollection)).toBe(false)
  })

  it('isSerializedMicrocosm should verify microcosm structure', () => {
    const identity = createIdentityID()
    const microcosm = { [identity]: { node_1: mockNode } }
    const invalidMicrocosm = { [identity]: { node_2: { ...mockNode, id: undefined } } }
    const mixedMicrocosm = { [identity]: { node_1: mockNode, node_2: incompleteNode } }
    expect(isSerializedMicrocosm(microcosm)).toBe(true)
    expect(isSerializedMicrocosm(invalidMicrocosm)).toBe(false)
    expect(isSerializedMicrocosm(mixedMicrocosm)).toBe(false)

    const invalidIdentity = { identity: { node_2: { ...mockNode, id: undefined } } }

    expect(isSerializedMicrocosm(invalidIdentity)).toBe(false)
  })
})
