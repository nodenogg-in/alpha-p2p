import { describe, expect, it } from 'vitest'
import { createMigration } from '../migrate'
import { createNodeID } from '../uuid'
import type { Node } from '../../schema/node.schema'
import { isNodeVersion } from '../../guards/node-guards'
import { isValidNodeID } from '../../guards/uuid-guards'

describe('Node operations', () => {
  describe('createNodeMigration function', () => {
    it('should apply migration correctly', () => {
      const oldNode: Node<'emoji'> = {
        type: 'emoji',
        schema: 1,
        id: createNodeID(),
        created: 123,
        lastEdited: 123,
        body: 'E'
      }

      const migrate = createMigration('emoji', [1, 2], {
        add: () => ({
          node_id: createNodeID()
        }),
        remove: []
      })

      expect(isNodeVersion(oldNode, 2)).toBeFalsy()
      expect(isNodeVersion(oldNode, 1)).toBeTruthy()

      const newNode = migrate(oldNode)

      expect(newNode.schema).toBe(2)
      expect(isNodeVersion(newNode, 2)).toBeTruthy()
      expect(isNodeVersion(newNode, 2, 'emoji')).toBeTruthy()
      expect(isValidNodeID(newNode.node_id)).toBeTruthy()
    })

    // it('should apply migration correctly to updated node in the new schema', () => {
    //   const oldNode = {
    //     type: 'emoji',
    //     schema: 1,
    //     id: createNodeID(),
    //     created: 123,
    //     lastEdited: 123,
    //     body: 'E',
    //   }

    //   const migrate = createMigration('emoji', [1, 2], {
    //     add: () => ({}),
    //     remove: []
    //   })

    //   expect(isNodeVersion(oldNode, 2)).toBeTruthy()
    //   expect(isNodeVersion(oldNode, 1)).toBeFalsy()

    //   const newNode = migrate(oldNode as any)

    //   expect(newNode.schema).toBe(2)
    //   expect(isNodeVersion(newNode, 2)).toBeTruthy()
    //   expect(isNodeVersion(newNode, 2, 'emoji')).toBeTruthy()
    //   expect(isValidNodeID(newNode.node_id)).toBeTruthy()
    //   expect(newNode.lastEdited).toBe(oldNode.lastEdited)
    //   expect(newNode.body).toBe(oldNode.body)
    // })
  })
})
