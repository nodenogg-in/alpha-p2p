import { describe, expect, it } from 'vitest'
import { create } from '../../operations/create'
import { isNodeType } from '../../node.schema'
import { createNodeID, isValidNodeID } from '../../uuid.schema'

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
})
