import type { FileParser, Serializer } from '../api'
import { isNode } from '@nodenogg.in/microcosm'
import { TelemetryError } from '@nodenogg.in/microcosm/telemetry'

export const parseJSON: FileParser = async (content: string) => {
  const parsed = JSON.parse(content)
  if (isNode(parsed)) {
    return parsed
  }
  throw new TelemetryError({
    name: 'parseJSON',
    message: 'Invalid JSON',
    level: 'warn'
  })
}

export const serializeJSON: Serializer = async (node) => JSON.stringify(node)
