import { Node } from '@nodenogg.in/schema'

export type ValidMimeType = 'text/markdown' | 'text/plain' | 'text/html' | 'image/svg+xml'

export const VALID_MIME_TYPES: ValidMimeType[] = [
  'text/markdown',
  'text/plain',
  'text/html',
  'image/svg+xml'
]

type WithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

export type ParsedHTMLNode = WithRequired<Node<'html'>, 'content' | 'type'>

export type FileParser = (file: string) => Promise<ParsedHTMLNode>
