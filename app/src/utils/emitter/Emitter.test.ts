import { describe, it, expect, vi } from 'vitest'
import { Emitter } from './Emitter'

class TestEmitter extends Emitter<{ event1: { message: string }; event2: { message: string } }> {
  public send = async (event: 'event1' | 'event2', data: { message: string }) => {
    this.emit(event, data)
  }
  public dispose = () => {
    this.clearListeners()
  }
}

describe('Emitter', () => {
  it('should handle event subscriptions and emissions', async () => {
    const emitter = new TestEmitter()

    const mockHandler = vi.fn()
    emitter.on('event1', mockHandler)

    await emitter.send('event1', { message: 'test' })

    expect(mockHandler).toHaveBeenCalledTimes(1)
    expect(mockHandler).toHaveBeenCalledWith({ message: 'test' })
  })

  it('should allow multiple subscriptions to the same event', async () => {
    const emitter = new TestEmitter()

    const mockHandler1 = vi.fn()
    const mockHandler2 = vi.fn()

    emitter.on('event1', mockHandler1)
    emitter.on('event1', mockHandler2)

    await emitter.send('event1', { message: 'test' })

    expect(mockHandler1).toHaveBeenCalledTimes(1)
    expect(mockHandler2).toHaveBeenCalledTimes(1)
  })

  it('should not call handlers after clearing listeners', async () => {
    const emitter = new TestEmitter()

    const mockHandler = vi.fn()
    emitter.on('event1', mockHandler)

    emitter.dispose()
    await emitter.send('event1', { message: 'test' })

    expect(mockHandler).not.toHaveBeenCalled()
  })
})
