import { describe, expect, it } from 'vitest'
import { create, update, createNodeUpgrade } from '../node-operations'
import type { Node } from '../node-types'
import { isNodeType, isNodeVersion } from '../node-guards'
import { createNodeID, isValidNodeID } from '../../utils/uuid'

describe('Node operations', () => {
  describe('create function', () => {
    it('should correctly initialize a new HTML node', () => {
      const node = create({
        type: 'html',
        body: '<p>Hello World</p>',
        x: 10,
        y: 20,
        width: 100,
        height: 200,
        background_color: 'white'
      })

      expect(isNodeType(node, 'html')).toBeTruthy()
      expect(node.id).toBeTruthy()
      expect(node.type).toBe('html')
      expect(node.created).not.toBeNaN()
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).not.toBeNaN()
    })

    it('should correctly initialize a new emoji node', () => {
      const node = create({
        type: 'emoji',
        content: 'e',
        node_id: 'node_id'
      })

      expect(isNodeType(node, 'emoji')).toBeTruthy()
      expect(node.id).toBeTruthy()
      expect(node.type).toBe('emoji')
      expect(node.created).not.toBeNaN()
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).not.toBeNaN()
    })

    it('should correctly initialize a new region node', () => {
      const node = create({
        type: 'region',
        x: 10,
        y: 20,
        width: 100,
        height: 200
      })

      expect(isNodeType(node, 'region')).toBeTruthy()
      expect(node.id).toBeTruthy()
      expect(node.type).toBe('region')
      expect(node.created).not.toBeNaN()
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).not.toBeNaN()
    })

    it('should correctly initialize a new ghost node', () => {
      const node = create({
        type: 'ghost',
        x: 10,
        y: 20,
        width: 100,
        height: 200,
        deleted: 0
      })

      expect(isNodeType(node, 'ghost')).toBeTruthy()
      expect(node.id).toBeTruthy()
      expect(node.type).toBe('ghost')
      expect(node.created).not.toBeNaN()
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).not.toBeNaN()
    })

    it('should correctly initialize a new ghost node', () => {
      const node = create({
        type: 'connection',
        from: 'node_id1',
        to: 'node_id2',
        content: ''
      })

      const validNode = create({
        type: 'connection',
        from: createNodeID(),
        to: createNodeID(),
        content: ''
      })

      expect(isNodeType(node, 'connection')).toBeTruthy()
      expect(isValidNodeID(node.id)).toBeTruthy()
      expect(isValidNodeID(node.from)).toBeFalsy()
      expect(isValidNodeID(node.to)).toBeFalsy()
      expect(isValidNodeID(validNode.from)).toBeTruthy()
      expect(isValidNodeID(validNode.to)).toBeTruthy()
      expect(node.type).toBe('connection')
      expect(node.created).not.toBeNaN()
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).not.toBeNaN()
    })
  })

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

      const migrate = createNodeUpgrade('emoji', [1, 2], {
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

      const migrate = createNodeUpgrade('emoji', [1, 2], {
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
