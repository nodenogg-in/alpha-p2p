import { is, parse } from 'valibot'
import { nodeSchema } from '@nodenogg.in/schema/src'
import { FileParser } from './api'

export const parseJSON: FileParser = async (content: string) => {
  const parsed = JSON.parse(content)
  return parse(nodeSchema, parsed)
}
