import { keys } from '@figureland/typekit/object'
import { isObject } from '@figureland/typekit/guards'
import { isPartialEntity } from './guards'
import type { Entity } from '@nodenogg.in/microcosm'

export const hasMetadata = (e: unknown): e is object => isObject(e) && keys(e).length > 0

export const isValidMetadata = <E extends Entity>(e: object): e is Partial<E> => isPartialEntity(e)
