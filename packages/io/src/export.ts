import type { Node } from '@nodenogg.in/microcosm'
import type { Serializer } from './api'
import { serializeMarkdown } from './formats/markdown'
import { serializeHTML } from './formats/html'
import { serializeJSON } from './formats/json'
import { promiseSome } from '@figureland/typekit/promise'

export type ExportFormat = (typeof EXPORT_FORMATS)[number]

export const EXPORT_FORMATS = ['text/markdown', 'text/html', 'application/json'] as const

type Serializers = Record<ExportFormat, Serializer>

export class Exporter {
  private readonly serializers: Serializers = {
    'text/markdown': serializeMarkdown,
    'text/html': serializeHTML,
    'application/json': serializeJSON
  }

  public exportNode = async (type: ExportFormat, content: Node<'html'>) =>
    this.serializers[type](content)

  public exportNodes = (type: ExportFormat, nodes: Node<'html'>[]) =>
    promiseSome(nodes.map((n) => this.exportNode(type, n)))
}
