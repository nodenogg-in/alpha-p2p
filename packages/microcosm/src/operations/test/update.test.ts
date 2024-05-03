import { describe, expect, it } from 'vitest'
import { update } from '../../operations/update'
import type { Node } from '../../schema/node.schema'
import { createNodeID } from '../uuid'
import { isNodeType, isValidNodeID } from '../..'

describe('Node operations', () => {
  describe('update function', () => {
    it('should update node properties and adjust lastEdited time', () => {
      const editTime = 1234500000
      const existingNode: Node<'html'> = {
        type: 'html',
        id: 'node_id',
        schema: 1,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }

      const updates = {
        body: '<p>Updated Content</p>'
      }

      const updatedNode = update(existingNode, updates)

      expect(updatedNode.body).toBe('<p>Updated Content</p>')
      expect(updatedNode.lastEdited).not.toBe(editTime)
    })

    it('should update node position and size', () => {
      const editTime = 1234500000
      const existingNode: Node<'html'> = {
        type: 'html',
        id: 'node_id',
        schema: 1,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }

      const updates = {
        body: '<p>Updated Content</p>',
        x: -100,
        y: 300.0001,
        width: 1000,
        height: 2000
      }

      const updatedNode = update(existingNode, updates)

      expect(updatedNode.body).toBe('<p>Updated Content</p>')
      expect(updatedNode.x).toBe(-100)
      expect(updatedNode.y).toBe(300.0001)
      expect(updatedNode.width).toBe(1000)
      expect(updatedNode.height).toBe(2000)
      expect(updatedNode.lastEdited).not.toBe(editTime)
    })

    it('should not omit readonly props from update', () => {
      const editTime = 1234500000
      const existingNode: Node<'html'> = {
        type: 'html',
        id: 'node_id',
        schema: 1,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }

      const updates = {
        type: 'emoji',
        id: 'broken id'
      }

      //@ts-expect-error
      const updatedNode = update(existingNode, updates)

      expect(updatedNode.type).toBe('html')
      expect(updatedNode.lastEdited).toBe(editTime)
    })

    it('should not omit readonly props from update but allow through valid updates', () => {
      const editTime = 1234500000
      const currentNodeId = createNodeID()
      const existingNode: Node<'html'> = {
        type: 'html',
        id: currentNodeId,
        schema: 1,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }

      const updates = {
        type: 'emoji',
        id: 'broken id',
        x: 10
      }

      const updatedNode = update(existingNode, updates)

      expect(updatedNode.type).toBe('html')
      expect(updatedNode.x).toBe(10)
      expect(updatedNode.id).toBe(currentNodeId)
      expect(isNodeType(updatedNode, 'html')).toBeTruthy()
      expect(updatedNode.lastEdited).not.toBe(editTime)
    })

    it('should update node properties and adjust lastEdited time', () => {
      const editTime = 1234500000
      const existingNode: Node<'emoji'> = {
        type: 'emoji',
        id: createNodeID(),
        schema: 2,
        created: 1234500000,
        lastEdited: editTime,
        body: '<p>Old Content</p>',
        node_id: 'node_id'
      }

      const updates = {
        body: 'X'
      }

      const updatedNode = update(existingNode, updates)
      expect(isNodeType(updatedNode, 'emoji')).toBeTruthy()
      expect(updatedNode.body).toBe('X')
      expect(isValidNodeID(updatedNode.node_id)).toBeFalsy()
      expect(updatedNode.lastEdited).not.toBe(editTime)
    })
  })
})
