import type { Node } from '@nodenogg.in/schema'
import type { Serializer } from './api'
import { serializeMarkdown } from './formats/markdown'
import { serializeHTML } from './formats/html'

export type ExportFormat = (typeof VALID_EXPORT_FORMATS)[number]

export const VALID_EXPORT_FORMATS = ['text/markdown', 'text/html'] as const

type Serializers = Record<ExportFormat, Serializer>

export class Exporter {
  private readonly serializers: Serializers = {
    'text/markdown': serializeMarkdown,
    'text/html': serializeHTML
  }

  public exportNode = async (type: ExportFormat, content: Node<'html'>) =>
  this.serializers[type](content)

  public exportNodes = (type: ExportFormat, nodes: Node<'html'>[]): Promise<string[]> =>
    Promise.all(nodes.map((n) => this.exportNode(type, n)))
}
