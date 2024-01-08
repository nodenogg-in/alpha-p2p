import { kebabCase } from 'scule'
import { is, string } from 'valibot'

export { v4 as createUuid } from '@lukeed/uuid'

export const validateMicrocosmName = (name: string) => is(string(), name) && name.length > 1

export const sanitiseMicrocosmName = (name: string) => kebabCase(name.trim())

export const createTimestamp = () => new Date().toISOString()

export const createURI = (namespace_id: string, microcosm_id: string) =>
  `${namespace_id}/${microcosm_id}`

export const pluralize = (items: unknown[], name: string) =>
  items.length === 1 ? `1 ${name}` : `${items.length} ${name}s`
