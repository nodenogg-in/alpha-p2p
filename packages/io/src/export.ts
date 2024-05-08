import type { Entity } from '@nodenogg.in/microcosm'
import type { Serializer } from './api'
import { serializeMarkdown } from './formats/markdown'
import { serializeHTML } from './formats/html'
import { serializeJSON } from './formats/json'
import { promiseSome } from '@figureland/typekit/promise'

export type ExportFormat = (typeof EXPORT_FORMATS)[number]

export const EXPORT_FORMATS = ['text/markdown', 'text/html', 'application/json'] as const

type Serializers = Record<ExportFormat, Serializer>

export class Exporter {
  private static serializers: Serializers = {
    'text/markdown': serializeMarkdown,
    'text/html': serializeHTML,
    'application/json': serializeJSON
  }

  static exportEntity = async (type: ExportFormat, content: Entity<'html'>) =>
    this.serializers[type](content)

  static exportEntities = (type: ExportFormat, entities: Entity<'html'>[]) =>
    promiseSome(entities.map((n) => this.exportEntity(type, n)))
}
