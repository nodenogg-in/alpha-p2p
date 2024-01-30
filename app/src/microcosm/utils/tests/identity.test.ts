import { describe, it, expect, vi } from 'vitest'
import { createUserIdentity } from '../identity'

vi.mock('../uuid', () => ({
  createUuid: () => 'test-uuid'
}))

describe('createUserIdentity', () => {
  it('should create a user identity with a valid user_id', () => {
    const identity = createUserIdentity()
    expect(identity).toHaveProperty('user_id')
    expect(identity.user_id).toBe('test-uuid')
  })
})
