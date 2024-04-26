import { isNodeType, type Node } from '@nodenogg.in/microcosm'
import { entries, keys } from '@figureland/typekit/object'
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter'
import { FileParser } from '../api'

const formats = 'yaml'

export const parseMarkdown: FileParser = async (value: string): Promise<Node> => {
  const parsed = micromark(value, {
    extensions: [frontmatter(formats), gfm()],
    htmlExtensions: [frontmatterHtml(formats), gfmHtml()],
    allowDangerousHtml: false
  })

  return {
    type: 'html',
    body: parsed.trim()
  } as Node<'html'>
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
