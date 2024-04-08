import { describe, it, expect } from 'vitest'
import { machine } from '../machine'

describe('machine', () => {
  it('initializes with the given initial state', () => {
    const m = machine('idle', {
      idle: { on: { start: 'running' } },
      running: { on: { stop: 'idle' } }
    })

    expect(m.get()).toBe('idle')
  })

  it('transitions to the next state based on an event', () => {
    const m = machine('idle', {
      idle: { on: { start: 'running' } },
      running: { on: { stop: 'idle' } }
    })

    m.send('start')
    expect(m.get()).toBe('running')

    m.send('stop')
    expect(m.get()).toBe('idle')
  })

  it('remains in the current state if an event does not exist', () => {
    const m = machine(
      'idle',
      {
        idle: { on: { start: 'running' } },
        running: { on: { stop: 'idle' } }
      },
      () => ({})
    )

    // @ts-expect-error
    m.send('pause') // 'pause' event does not exist in 'idle' state
    expect(m.get()).toBe('idle')
  })

  it('correctly identifies if it is in a specified state', () => {
    const m = machine('idle', {
      idle: { on: { start: 'running' } },
      running: { on: { stop: 'idle' } }
    })

    expect(m.is('idle')).toBe(true)
    expect(m.is('running')).toBe(false)

    m.send('start')
    expect(m.is('idle')).toBe(false)
    expect(m.is('running')).toBe(true)
  })
})
