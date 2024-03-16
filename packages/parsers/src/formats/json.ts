import { parse } from 'valibot'
import { nodeSchema } from '@nodenogg.in/schema'
import { FileParser } from '../api'

export const parseJSON: FileParser = async (content: string) =>
  parse(nodeSchema, JSON.parse(content))
