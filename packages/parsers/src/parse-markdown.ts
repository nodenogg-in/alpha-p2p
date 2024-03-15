import { type Node, htmlNodeSchema } from '@nodenogg.in/schema'
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter'
import { matter } from 'vfile-matter'
import { is, partial } from 'valibot'
import { VFile } from 'vfile'
import { FileParser } from './api'

declare module 'vfile' {
  interface DataMap {
    matter: Omit<Node<'html'>, 'content'>
  }
}

const frontmatterFormat = 'yaml'

export const parseMarkdown: FileParser = async (value: string) => {
  const file = new VFile(value)
  matter(file, { strip: true })

  const validMetadata = is(partial(htmlNodeSchema), file.data.matter)

  const parsed = micromark(file.toString(), {
    extensions: [frontmatter([frontmatterFormat]), gfm()],
    htmlExtensions: [frontmatterHtml([frontmatterFormat]), gfmHtml()]
  })

  return {
    ...(validMetadata && file.data.matter),
    type: 'html',
    content: parsed
  }
}
