import { describe, expect, it } from 'vitest'
import { update } from '../../operations/update'
import type { Node } from '../../node.types'
import { isNodeType } from '../../node.guards'
import { createNodeID } from '../../uuid.utils'
import { isValidNodeID } from '../../uuid.guards'

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

    it('should update node properties and adjust lastEdited time', () => {
      const editTime = 1234500000
      const existingNode: Node<'emoji'> = {
        type: 'emoji',
        id: createNodeID(),
        schema: 1,
        created: 1234500000,
        lastEdited: editTime,
        content: '<p>Old Content</p>',
        node_id: 'node_id'
      }

      const updates = {
        content: 'X'
      }

      const updatedNode = update(existingNode, updates)
      expect(isNodeType(updatedNode, 'emoji')).toBeTruthy()
      expect(updatedNode.content).toBe('X')
      expect(isValidNodeID(updatedNode.node_id)).toBeFalsy()
      expect(updatedNode.lastEdited).not.toBe(editTime)
    })
  })
})
