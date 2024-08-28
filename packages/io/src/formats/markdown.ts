import { isEntityType, type Entity } from '@nodenogg.in/microcosm'
import { entries, keys } from '@figureland/kit/ts/object'
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter'
import type { FileParser, ParsedEntity } from '../api'

const formats = 'yaml'

export const parseMarkdown: FileParser<ParsedEntity<'html'>> = async (value: string) => {
  const parsed = micromark(value, {
    extensions: [frontmatter(formats), gfm()],
    htmlExtensions: [frontmatterHtml(formats), gfmHtml()],
    allowDangerousHtml: false
  })

  return {
    type: 'html',
    body: parsed.trim()
  } as ParsedEntity<'html'>
}

const exportToMarkdown = (bodyContent: string, o?: object) => {
  let body = ''
  if (o) body += simpleYAMLSerialize(o)
  body += bodyContent
  return body
}

export const serializeMarkdown = async (entity: Entity): Promise<string> => {
  if (isEntityType(entity, 'html')) {
    const { body, ...metadata } = entity
    return exportToMarkdown(body, metadata)
  }
  return exportToMarkdown('', entity)
}

export const simpleYAMLSerialize = (o: object) => {
  if (keys(o).length === 0) {
    return ''
  }

  let content = '---\n'
  entries(o).forEach(([k, v]) => {
    content += [k, ': ', v, '\n'].join('')
  })
  content += '---\n'
  return content
}
