import { describe, expect, it } from 'vitest'
import { createUpgrade } from '../../operations/upgrade'
import type { Node } from '../../node.schema'
import { isNodeVersion } from '../../node.schema'
import { isValidNodeID, createNodeID } from '../../uuid.schema'

describe('Node operations', () => {
  describe('createNodeUpgrade function', () => {
    it('should apply migration correctly', () => {
      const oldNode: Node<'emoji'> = {
        type: 'emoji',
        schema: 1,
        id: createNodeID(),
        created: 123,
        lastEdited: 123,
        content: 'E',
        node_id: createNodeID()
      }

      const migrate = createUpgrade('emoji', [1, 2], {
        add: () => ({
          background_color: '#000000'
        }),
        remove: []
      })

      expect(isNodeVersion(oldNode, 2)).toBeFalsy()
      expect(isNodeVersion(oldNode, 1)).toBeTruthy()

      const newNode = migrate(oldNode)

      expect(newNode.schema).toBe(2)
      expect(isNodeVersion(newNode, 2)).toBeTruthy()
      expect(newNode.background_color).toBe('#000000')
      expect(isValidNodeID(newNode.node_id)).toBeTruthy()
    })

    it('should apply migration correctly to updated node in the new schema', () => {
      const oldNode = {
        type: 'emoji',
        schema: 2,
        id: createNodeID(),
        created: 123,
        lastEdited: 123,
        content: 'E',
        node_id: createNodeID()
      }

      const migrate = createUpgrade('emoji', [1, 2], {
        add: () => ({
          background_color: '#000000'
        }),
        remove: []
      })

      expect(isNodeVersion(oldNode, 2)).toBeTruthy()
      expect(isNodeVersion(oldNode, 1)).toBeFalsy()

      const newNode = migrate(oldNode as any)

      expect(newNode.schema).toBe(2)
      expect(isNodeVersion(newNode, 2)).toBeTruthy()
      expect(newNode.background_color).toBeUndefined()
      expect(isValidNodeID(newNode.node_id)).toBeTruthy()
      expect(newNode.lastEdited).toBe(oldNode.lastEdited)
    })
  })
})
