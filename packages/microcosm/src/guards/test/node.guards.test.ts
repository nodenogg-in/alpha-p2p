import { describe, it, expect } from 'vitest'
import { createNodeID } from '../../operations/uuid'
import { isNode, isNodeType, isNodeVersion, isSpatialNode } from '../..'

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

describe('Node validation functions', () => {
  it('isNode should verify node structure', () => {
    expect(isNode(mockNode)).toBe(true)
    expect(isNode(incompleteNode)).toBe(false)
    expect(isNode(wrongTypeNode)).toBe(false)
  })

  it('isNodeType should verify node type', () => {
    expect(isNodeType(mockNode, 'html')).toBe(true)
    expect(isNodeType(mockNode, 'region')).toBe(false)
    expect(isNodeType(wrongTypeNode, 'nonexistentType' as any)).toBe(false)
  })

  it('isSpatialNode should verify spatial properties', () => {
    expect(isSpatialNode(mockNode)).toBe(true)
    const nonSpatialNode = { ...mockNode, x: undefined }
    expect(isSpatialNode(nonSpatialNode)).toBe(false)
    expect(isSpatialNode(incompleteNode)).toBe(false)
  })

  it('isNodeVersion should verify schema version', () => {
    expect(isNodeVersion(mockNode, 1)).toBe(true)
    expect(isNodeVersion(mockNode, 2)).toBe(false)
    expect(isNodeVersion(mockNode, 1, 'html')).toBe(true)
    expect(isNodeVersion(mockNode, 1, 'emoji')).toBe(false)
    expect(isNodeVersion(incompleteNode, 1)).toBe(false)
  })
})
