import { describe, expect, it } from 'vitest'
import { fromPartial } from '../../operations/partial'
import { create, isNode, isNodeType } from '../..'
import { latestNodeSchemaVersions } from '../../schema/node.schema'

describe('Node operations', () => {
  describe('create function', () => {
    it('should correctly initialize a new HTML node', () => {
      const node = create(
        fromPartial({
          type: 'html'
        })
      )

      expect(isNodeType(node, 'html')).toBeTruthy()
      expect(node.id).toBeTruthy()
      expect(node.type).toBe('html')
      expect(node.created).not.toBeNaN()
      expect(node.x).toBe(0)
      expect(node.y).toBe(0)
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).toBe(latestNodeSchemaVersions.html)
    })

    it('should correctly initialize a new emoji node', () => {
      const node = create(
        fromPartial({
          type: 'emoji'
        })
      )

      expect(isNodeType(node, 'emoji')).toBeTruthy()
      expect(node.id).toBeTruthy()
      expect(node.type).toBe('emoji')
      expect(node.created).not.toBeNaN()
      expect(node.body).toBe('')
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).not.toBeNaN()
      expect(node.schema).toBe(latestNodeSchemaVersions.emoji)
      expect(isNode(node)).toBeTruthy()
    })

    it('should correctly initialize a new connection node', () => {
      const node = create(
        fromPartial({
          type: 'connection'
        })
      )

      expect(isNodeType(node, 'connection')).toBeTruthy()
      expect(node.id).toBeTruthy()
      expect(node.type).toBe('connection')
      expect(node.created).not.toBeNaN()
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).not.toBeNaN()
      expect(node.schema).toBe(latestNodeSchemaVersions.connection)
      expect(isNode(node)).toBeTruthy()
    })

    it('should correctly initialize a new ghost node', () => {
      const node = create(
        fromPartial({
          type: 'ghost'
        })
      )

      expect(isNodeType(node, 'ghost')).toBeTruthy()
      expect(node.id).toBeTruthy()
      expect(node.type).toBe('ghost')
      expect(node.created).not.toBeNaN()
      expect(node.x).toBe(0)
      expect(node.y).toBe(0)
      expect(node.width).toBe(0)
      expect(node.height).toBe(0)
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).toBe(latestNodeSchemaVersions.ghost)
      expect(isNode(node)).toBeTruthy()
    })

    it('should correctly initialize a new region node', () => {
      const node = create(
        fromPartial({
          type: 'region'
        })
      )

      expect(isNodeType(node, 'region')).toBeTruthy()
      expect(node.id).toBeTruthy()
      expect(node.type).toBe('region')
      expect(node.created).not.toBeNaN()
      expect(node.x).toBe(0)
      expect(node.y).toBe(0)
      expect(node.width).toBe(0)
      expect(node.height).toBe(0)
      expect(node.lastEdited).not.toBeNaN()
      expect(node.schema).toBe(latestNodeSchemaVersions.region)
      expect(isNode(node)).toBeTruthy()
    })
  })
})
