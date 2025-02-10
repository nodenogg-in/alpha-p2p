import { isEntity } from '@nodenogg.in/microcosm'
import type { FileParser, ParsedEntity, Serializer } from '../api'
import { TelemetryError } from '@nodenogg.in/microcosm/telemetry'

export const parseJSON: FileParser<ParsedEntity> = async (content: string) => {
  const parsed = JSON.parse(content)
  if (isEntity(parsed)) {
    return parsed
  }
  throw new TelemetryError({
    name: 'parseJSON',
    message: 'Invalid JSON',
    level: 'warn'
  })
}

export const serializeJSON: Serializer = async (node) => JSON.stringify(node)
