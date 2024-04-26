import { keys } from '@figureland/typekit/object'
import { isObject } from '@figureland/typekit/guards'
import { type Node } from '@nodenogg.in/microcosm'
import { isPartialNode } from './guards'

export const hasMetadata = (data: unknown): data is object =>
  isObject(data) && keys(data).length > 0

export const isValidMetadata = <N extends Node>(data: object): data is Partial<N> =>
  isPartialNode(data)
