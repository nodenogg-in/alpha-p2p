import type { Entity } from '@nodenogg.in/microcosm'
import { settle } from '@figureland/kit/tools/async'

import type { Serializer } from './api'
import { serializeMarkdown } from './formats/markdown'
import { serializeHTML } from './formats/html'
import { serializeJSON } from './formats/json'

export type ExportFormat = (typeof EXPORT_FORMATS)[number]

export const EXPORT_FORMATS = ['text/markdown', 'text/html', 'application/json'] as const

type Serializers = Record<ExportFormat, Serializer>

const serializers: Serializers = {
  'text/markdown': serializeMarkdown,
  'text/html': serializeHTML,
  'application/json': serializeJSON
}

export const exportEntity = async (type: ExportFormat, content: Entity<'html'>) =>
  serializers[type](content)

export const exportEntities = (type: ExportFormat, entities: Entity<'html'>[]) =>
  settle(entities.map((n) => exportEntity(type, n)))
