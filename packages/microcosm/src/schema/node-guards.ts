import { entries, isNumber, isObject, isString, values } from '@figureland/typekit'
import { type Node, type NodeType, type SpatialNode, nodeTypes } from './node-types'
import type { SchemaNumber, Version } from './schema-types'
import type { SerializedCollection, SerializedMicrocosm } from './microcosm-types'
import { isValidIdentityID, isValidNodeID } from '../utils/uuid'

export const isNode = (node: unknown): node is Node =>
  isObject(node) &&
  'type' in node &&
  isString(node.type) &&
  nodeTypes.includes(node.type as NodeType) &&
  'schema' in node &&
  isNumber(node.schema) &&
  'lastEdited' in node &&
  isNumber(node.lastEdited) &&
  'created' in node &&
  isNumber(node.created) &&
  'id' in node &&
  isValidNodeID(node.id)

export const isNodeType = <T extends string & NodeType>(node: unknown, type: T): node is Node<T> =>
  isNode(node) && node.type === type

export const isSpatialNode = <N extends SpatialNode>(node: unknown): node is N =>
  isNode(node) &&
  'x' in node &&
  isNumber(node.x) &&
  'y' in node &&
  isNumber(node.y) &&
  'width' in node &&
  isNumber(node.width) &&
  'height' in node &&
  isNumber(node.height)

export const isNodeVersion = <S extends SchemaNumber, T extends string & NodeType>(
  node: unknown,
  schema: S,
  type?: T
): node is Version<S, T extends NodeType ? Node<T> : Node> => {
  const check = isNode(node) && node.schema === schema
  return type ? isNodeType(node, type) && check : check
}

export const isSerializedCollection = (collection: unknown): collection is SerializedCollection =>
  isObject(collection) && values(collection).every(isNode)

export const isSerializedMicrocosm = (microcosm: unknown): microcosm is SerializedMicrocosm =>
  isObject(microcosm) &&
  entries(microcosm).every(
    ([id, collection]) => isValidIdentityID(id) && isSerializedCollection(collection)
  )
