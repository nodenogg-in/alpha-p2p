import { entries, isNumberLike } from '@figureland/typekit'
import { type Node, isNodeType } from '@nodenogg.in/microcosm'
import type { FileParser, ParsedNode, Serializer } from '../api'
import { hasMetadata, isValidMetadata } from './utils/metadata'
import { isPartialNodeType } from './utils/guards'

export const parseHtml: FileParser = async (content: string) =>
  parseHTMLString(content, META_PREFIX)

const META_PREFIX = 'nodenoggin:node:'

const parseHTMLString = (html: string, prefix: string): ParsedNode => {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const result = {}

  const metas = parsed.getElementsByTagName('meta')
  for (let i = 0; i < metas.length; i++) {
    const name = metas[i].getAttribute('name')
    const content = metas[i].getAttribute('content')
    if (name && content && name.startsWith(prefix)) {
      result[name.replace(META_PREFIX, '')] = isNumberLike(content)
        ? parseFloat(content)
        : content.trim()
    }
  }

  const metadata = hasMetadata(result) && isValidMetadata(result) ? result : {}

  if (isPartialNodeType(metadata, 'html') || !metadata.type) {
    return {
      type: 'html',
      ...metadata,
      body: parsed.body.innerHTML.trim()
    } as ParsedNode<'html'>
  }
  return metadata as ParsedNode
}

interface DOMDocument {
  createElement: (tag: string) => HTMLElement
}

const createMeta = (doc: DOMDocument, prefix: string, o: object) => {
  const head = doc.createElement('head')

  entries(o).forEach(([k, v]) => {
    const meta = doc.createElement('meta')
    meta.setAttribute('name', `${prefix}${k}`)
    meta.setAttribute('content', v)
    head.appendChild(meta)
  })
  return head
}

export const serializeHTML: Serializer = async (node: Node): Promise<string> => {
  const html = document.createElement('html')
  if (isNodeType(node, 'html')) {
    const { body, ...rest } = node
    html.appendChild(createMeta(document, META_PREFIX, rest))
    const isPartialNode = document.createElement('body')
    isPartialNode.innerHTML = body.trim()
    html.appendChild(isPartialNode)
  } else {
    html.appendChild(createMeta(document, META_PREFIX, node))
  }

  return new XMLSerializer().serializeToString(html).trim()
}
