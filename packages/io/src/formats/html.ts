import { parse, partial } from 'valibot'
import { entries, isNumberLike } from '@figureland/typekit'
import { type Node, htmlNodeSchema } from '@nodenogg.in/microcosm'
import type { FileParser, ParsedNode, Serializer } from '../api'

export const parseHtml: FileParser = async (content: string) =>
  parseHTMLString(content, META_PREFIX)

const META_PREFIX = 'nodenoggin:node:'

const parseHTMLString = (html: string, prefix: string): ParsedNode<'html'> => {
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

  return {
    ...parse(partial(htmlNodeSchema), result),
    type: 'html',
    content: parsed.body.innerHTML
  }
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

export const serializeHTML: Serializer = async ({ content, ...rest }: Node): Promise<string> => {
  const html = document.createElement('html')
  html.appendChild(createMeta(document, META_PREFIX, rest))
  const body = document.createElement('body')
  body.innerHTML = content.trim()
  html.appendChild(body)

  return new XMLSerializer().serializeToString(html).trim()
}
