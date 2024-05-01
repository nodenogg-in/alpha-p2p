import { describe, expect, it } from 'vitest'
import { create } from '../../operations/create'
import { clone } from '../../operations/clone'
import { isNodeType } from '../../node.schema'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('clone function', () => {
  it('should correctly clone a new HTML node', async () => {
    const node = create({
      type: 'html',
      body: '<p>Hello World</p>',
      x: 10,
      y: 20,
      width: 100,
      height: 200,
      background_color: 'white'
    })

    await delay(1)

    const cloned = clone(node)
    expect(isNodeType(cloned, 'html')).toBeTruthy()
    expect(cloned.id).not.toBe(node.id)
    expect(cloned.type).toBe('html')
    expect(cloned.created).not.toBe(node.created)
    expect(cloned.lastEdited).not.toBe(node.created)
    expect(cloned.schema).toBe(node.schema)
  })
})
