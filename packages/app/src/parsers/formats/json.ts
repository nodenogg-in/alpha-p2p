import { parse } from 'valibot'
import { nodeSchema } from '@nodenogg.in/microcosm'
import type { FileParser } from '../api'

export const parseJSON: FileParser = async (content: string) =>
  parse(nodeSchema, JSON.parse(content))
