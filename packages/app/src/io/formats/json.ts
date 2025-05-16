import { entity, NNError } from '@nodenogg.in/core'
import type { FileParser, ParsedEntity, Serializer } from '../api'

export const parseJSON: FileParser<ParsedEntity> = async (content: string) => {
  try {
    const parsed = JSON.parse(content)
    const result = entity.schema.validate(parsed)
    return result
  } catch (error) {
    throw new NNError({
      name: 'parseJSON',
      message: 'Invalid JSON',
      level: 'warn'
    })
  }
}

export const serializeJSON: Serializer = async (node) => JSON.stringify(node)
