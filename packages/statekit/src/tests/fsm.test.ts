import { describe, it, expect } from 'vitest'
import { fsm } from '../fsm'

describe('fsm', () => {
  it('initializes with the given initial state', () => {
    const machine = fsm('idle', {
      idle: { on: { start: 'running' } },
      running: { on: { stop: 'idle' } }
    })

    expect(machine.get()).toBe('idle')
  })

  it('transitions to the next state based on an event', () => {
    const machine = fsm('idle', {
      idle: { on: { start: 'running' } },
      running: { on: { stop: 'idle' } }
    })

    machine.send('start')
    expect(machine.get()).toBe('running')

    machine.send('stop')
    expect(machine.get()).toBe('idle')
  })

  it('remains in the current state if an event does not exist', () => {
    const machine = fsm('idle', {
      idle: { on: { start: 'running' } },
      running: { on: { stop: 'idle' } }
    })

    // @ts-expect-error
    machine.send('pause') // 'pause' event does not exist in 'idle' state
    expect(machine.get()).toBe('idle')
  })

  it('correctly identifies if it is in a specified state', () => {
    const machine = fsm('idle', {
      idle: { on: { start: 'running' } },
      running: { on: { stop: 'idle' } }
    })

    expect(machine.isIn('idle')).toBe(true)
    expect(machine.isIn('running')).toBe(false)

    machine.send('start')
    expect(machine.isIn('running')).toBe(true)
    expect(machine.isIn('idle')).toBe(false)
  })
})
