import { type Node, htmlNodeSchema } from '@nodenogg.in/microcosm'
import { entries, keys } from '@figureland/typekit'
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter'
import { matter } from 'vfile-matter'
import { is, partial } from 'valibot'
import { VFile } from 'vfile'
import { FileParser } from '../api'

declare module 'vfile' {
  interface DataMap {
    matter: Omit<Node<'html'>, 'content'>
  }
}

const formats = 'yaml'

export const parseMarkdown: FileParser = async (value: string) => {
  const file = new VFile(value)
  matter(file, { strip: true })

  const validMetadata = is(partial(htmlNodeSchema), file.data.matter)

  const parsed = micromark(file.toString(), {
    extensions: [frontmatter(formats), gfm()],
    htmlExtensions: [frontmatterHtml(formats), gfmHtml()],
    allowDangerousHtml: true
  })

  return {
    ...(validMetadata && file.data.matter),
    type: 'html',
    content: parsed
  }
}

export const serializeMarkdown = async ({ content, ...metadata }: Node): Promise<string> =>
  exportToMarkdown(content, metadata)

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

export const exportToMarkdown = (body: string, o?: object) => {
  let content = ''
  if (o) content += simpleYAMLSerialize(o)
  content += body
  return content
}
