import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { signalObject } from '../signal-object'

describe('signalObject', () => {
  it('creates a signalObject and retrieves its initial values', () => {
    const initialObj = { a: 1, b: 'test' }
    const objSignal = signalObject(initialObj)
    expect(objSignal.get()).toEqual(initialObj)
  })
  it('sets and gets a single signal value', () => {
    const objSignal = signalObject({ a: 1, b: 'test' })
    objSignal.key('a').set(2)
    expect(objSignal.key('a').get()).toBe(2)
  })
  it('globally sets and gets updated values', () => {
    const objSignal = signalObject({ a: 1, b: 'initial' })
    objSignal.set({ a: 2, b: 'updated' })
    expect(objSignal.get()).toEqual({ a: 2, b: 'updated' })
  })
  it('notifies subscribers on any signal update', () => {
    const objSignal = signalObject({ a: 1, b: 'initial' })
    let receivedObj
    objSignal.on((updatedObj) => {
      receivedObj = updatedObj
    })
    objSignal.set({ a: 2 })
    expect(receivedObj).toEqual({ a: 2, b: 'initial' })
  })
  it('disposes of all signals and stops notifications', () => {
    const objSignal = signalObject({ a: 1, b: 'initial' })
    let calls = 0
    objSignal.on(() => {
      calls += 1
    })
    objSignal.dispose()
    objSignal.set({ a: 2 })
    expect(calls).toBe(0)
  })
  it('handles partial updates correctly', () => {
    const objSignal = signalObject({ a: 1, b: 'initial', c: true })
    objSignal.set({ b: 'updated' })
    expect(objSignal.get()).toEqual({ a: 1, b: 'updated', c: true })
  })
})
