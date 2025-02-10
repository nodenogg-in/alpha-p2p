import { isNumberLike } from '@figureland/kit/tools/guards'
import { entries } from '@figureland/kit/tools/object'
import { type Entity, isEntityType } from '@nodenogg.in/microcosm'
import type { FileParser, ParsedEntity, Serializer } from '../api'
import { hasMetadata, isValidMetadata } from './utils/metadata'
import { isPartialEntityType } from './utils/guards'

export const parseHtml: FileParser<ParsedEntity> = async (content: string) =>
  parseHTMLString(content, META_PREFIX)

const META_PREFIX = 'nodenoggin:entity:'

const parseHTMLString = (html: string, prefix: string): ParsedEntity => {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const result = {}

  console.log(html)
  console.log(parsed)
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

  console.log(metadata)
  if (isPartialEntityType(metadata, 'html')) {
    return {
      ...metadata,
      body: parsed.body.innerHTML.trim()
    } as ParsedEntity<'html'>
  }
  return metadata as ParsedEntity
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

export const serializeHTML: Serializer = async (entity: Entity): Promise<string> => {
  const html = document.createElement('html')
  if (isEntityType(entity, 'html')) {
    const { body, ...rest } = entity
    html.appendChild(createMeta(document, META_PREFIX, rest))
    const isPartialEntity = document.createElement('body')
    isPartialEntity.innerHTML = body.trim()
    html.appendChild(isPartialEntity)
  } else {
    html.appendChild(createMeta(document, META_PREFIX, entity))
  }

  return new XMLSerializer().serializeToString(html).trim()
}
