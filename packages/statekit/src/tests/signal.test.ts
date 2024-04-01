import { describe, it, expect } from 'vitest'
import { signal } from '../signal'

describe('signal', () => {
  it('creates a signal and retrieves its value', () => {
    const initialValue = 10
    const numSignal = signal(() => initialValue)
    expect(numSignal.get()).toBe(initialValue)
  })
  it('creates a signal and retrieves its value', () => {
    const initialValue = 10
    const numSignal = signal(() => initialValue)
    expect(numSignal.get()).toBe(initialValue)
  })
  it('updates the signal value', () => {
    const numSignal = signal(() => 10)
    numSignal.set(20)
    expect(numSignal.get()).toBe(20)
  })
  it('notifies subscribers on update', () => {
    const numSignal = signal(() => 10)
    let receivedValue = 0
    numSignal.on((value) => {
      receivedValue = value
    })
    numSignal.set(20)
    expect(receivedValue).toBe(20)
  })
  it('stops notifying after unsubscribe', () => {
    const numSignal = signal(() => 10)
    let calls = 0
    const unsubscribe = numSignal.on(() => {
      calls += 1
    })
    numSignal.set(20)
    unsubscribe()
    numSignal.set(30)
    expect(calls).toBe(1)
  })

  it('disposes of all subscriptions', () => {
    const numSignal = signal(() => 10)
    let calls = 0
    numSignal.on(() => {
      calls += 1
    })
    numSignal.dispose()
    numSignal.set(20)
    expect(calls).toBe(0)
  })
})

describe('signal with options', () => {
  it('tracks nested signals when track option is true', () => {})

  it('uses custom equality function', () => {
    const customEquality = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)
    const signalWithOptions = signal(() => ({ a: 1 }), { equality: customEquality })
  })
})
