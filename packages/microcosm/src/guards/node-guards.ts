import { isNumber, isObject, isString } from '@figureland/typekit/guards'
import { isValidNodeID } from '../operations/uuid'
import type { SchemaNumber, Version } from '../schema/nodes/schema'
import { nodeTypes } from '..'
import { Node, NodeType } from '../schema/node.schema'
import { SpatialNode } from '../schema/nodes/shared'

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
