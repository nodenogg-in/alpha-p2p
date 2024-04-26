import { isNodeType, type Node } from '@nodenogg.in/microcosm'
import { entries, keys } from '@figureland/typekit'
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter'
import { matter } from 'vfile-matter'
import { VFile } from 'vfile'
import { FileParser } from '../api'
import { TelemetryError } from '@nodenogg.in/microcosm/telemetry'
import { hasMetadata, isValidMetadata } from './utils/metadata'

declare module 'vfile' {
  interface DataMap {
    matter: Omit<Node<'html'>, 'content'>
  }
}

const formats = 'yaml'

export const parseMarkdown: FileParser = async (value: string): Promise<Node> => {
  const file = new VFile(value)
  matter(file, { strip: true })

  if (hasMetadata(file.data.matter) && !isValidMetadata(file.data.matter)) {
    throw new TelemetryError({
      name: 'parseMarkdown',
      level: 'warn',
      message: `Invalid metadata in frontmatter ${JSON.stringify(file.data.matter)}`
    })
  }

  const parsed = micromark(file.toString(), {
    extensions: [frontmatter(formats), gfm()],
    htmlExtensions: [frontmatterHtml(formats), gfmHtml()],
    allowDangerousHtml: true
  })

  return {
    ...file.data.matter,
    type: 'html',
    body: parsed.trim()
  } as Node
}

const exportToMarkdown = (bodyContent: string, o?: object) => {
  let body = ''
  if (o) body += simpleYAMLSerialize(o)
  body += bodyContent
  return body
}

export const serializeMarkdown = async (node: Node): Promise<string> => {
  if (isNodeType(node, 'html')) {
    const { body, ...metadata } = node
    return exportToMarkdown(body, metadata)
  }
  return exportToMarkdown('', node)
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
