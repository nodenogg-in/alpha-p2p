import {
  number,
  object,
  string,
  type Input,
  optional,
  literal,
  variant,
  special,
  Output
} from 'valibot'
import { MicrocosmID, NodeID } from './uuid.schema'
import { isValidMicrocosmID } from '../utils/uuid'
import { Vector2 } from '@figureland/mathkit/vector2'
export const microcosmID = special<MicrocosmID>(isValidMicrocosmID)

// This is where the core data types for nodenoggin are stored.
// They are defined as schema objects so that the data can be
// validated as with a decentralised architecture there could be a lot
// of messages coming in and out from completely untrusted and/or
// unknown sources.

// Whenever we want to check if an unknown piece of data is a valid
// according to the nodenoggin schema we can use valibot's is() helper
// for example:

// import { is } from 'valibot'

// if (is(nodeSchema, data)) {
//   ... do action safely with data knowing it is a valid Node
// }

// The type definitions are then inferred from these schema objects.

/**
 * Validation schema for a single node
 * @example
 * A simple example of how to use this schema:
 * ```ts
 * const node = {
 *   type: 'html',
 *   lastEdited: 2,
 *   content: 'Hello, world!',
 *   x: 0,
 *   y: 0,
 *   width: 100,
 *   height: 100
 * }
 *
 * if (is(nodeSchema, node)) {
 *    ...
 * }
 * ```
 */

type BaseNode<T extends string, N extends Record<string, any>> = N & {
  type: T
  schema: number
  lastEdited: number
}

type SpatialNode = {
  x: number
  y: number
  z?: number
  width: number
  height: number
  depth?: number
  locked?: number
}

export type RegionNode = BaseNode<
  'region',
  SpatialNode & {
    title?: string
    background_color?: string
  }
>

export type GhostNode = BaseNode<
  'ghost',
  SpatialNode & {
    deleted: number
  }
>

export type HTMLNode = BaseNode<
  'html',
  SpatialNode & {
    body: string
    background_color?: string
  }
>

export type EmojiNode = BaseNode<
  'emoji',
  {
    node_id: NodeID
    content: string
  }
>

export type EdgeNode = BaseNode<
  'edge',
  {
    from: NodeID
    to: NodeID
    content: string
  }
>

export type NNodes = HTMLNode | RegionNode | GhostNode | EmojiNode | EdgeNode

export type NNodeType = NNodes['type']

export type NNode<T extends NNodeType = NNodeType> = T extends 'html'
  ? HTMLNode
  : T extends 'region'
    ? RegionNode
    : T extends 'ghost'
      ? GhostNode
      : T extends 'emoji'
        ? EmojiNode
        : T extends 'edge'
          ? EdgeNode
          : NNode

const exampleRegion: NNode = {
  schema: 1,
  type: 'ghost',
  lastEdited: 1,
  deleted: 2,
  x: 0,
  y: 0,
  width: 100,
  height: 100
}

export const htmlNodeSchema = object({
  schema: number(),
  type: literal('html'),
  lastEdited: number(),
  content: string(),
  x: number(),
  y: number(),
  width: number(),
  height: number(),
  background_color: optional(string())
})

export const connectionNodeSchema = object({
  schema: number(),
  type: literal('connection'),
  lastEdited: number(),
  to: string(),
  from: string(),
  color: optional(string()),
  content: string()
})

export const emojiNodeSchema = object({
  schema: number(),
  type: literal('emoji'),
  lastEdited: number(),
  content: string(),
  node: string()
})

export const nodeSchema = variant('type', [htmlNodeSchema, connectionNodeSchema, emojiNodeSchema])

export type NodeMap = {
  html: Output<typeof htmlNodeSchema>
  emoji: Output<typeof emojiNodeSchema>
  connection: Output<typeof connectionNodeSchema>
}

export type Node<T extends string | undefined = undefined> = T extends keyof NodeMap
  ? NodeMap[T]
  : Input<typeof nodeSchema>

export type NodeType = keyof NodeMap

/**
 * Validation schema for a single Microcosm
 */
export const microcosmReferenceSchema = object({
  microcosmID: microcosmID,
  lastAccessed: number(),
  password: optional(string()),
  view: optional(string())
})

export type MicrocosmReference = Input<typeof microcosmReferenceSchema>

export type NodeReference<T extends NodeType = NodeType> = [NodeID, Node<T>]
