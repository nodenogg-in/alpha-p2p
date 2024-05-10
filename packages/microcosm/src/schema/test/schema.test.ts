import { describe, expect, it } from 'vitest'
import { latestEntitySchemaVersions } from '../entity.schema'
import { entries } from '@figureland/typekit/object'
import { fromPartialEntity } from '../../operations/partial'
import { create } from '../../operations/create'

describe('schema versions', () => {
  it('new entities should use the defined latest active version', async () => {
    entries(latestEntitySchemaVersions).forEach(([type, v]) => {
      const newEntity = create(
        fromPartialEntity({
          type
        })
      )
      expect(newEntity.schema).toBe(v)
    })
  })
})
