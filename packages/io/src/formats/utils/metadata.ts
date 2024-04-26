import { isObject, keys } from '@figureland/typekit'
import { type Node } from '@nodenogg.in/microcosm'
import { isPartialNode } from './guards'

export const hasMetadata = (data: unknown): data is object =>
  isObject(data) && keys(data).length > 0

export const isValidMetadata = <N extends Node>(data: object): data is Partial<N> =>
  isPartialNode(data)
