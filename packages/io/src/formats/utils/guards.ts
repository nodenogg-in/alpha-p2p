import { isNumber, isObject, isString } from '@figureland/typekit'
import { type Node, type NodeType, isValidNodeID, nodeTypes } from '@nodenogg.in/microcosm'

export const isPartialNode = (node: unknown): node is Partial<Node> => {
  if (!isObject(node)) {
    return false
  }
  const hasType = 'type' in node && isString(node.type) && nodeTypes.includes(node.type as NodeType)

  return (
    hasType ||
    ('schema' in node && isNumber(node.schema)) ||
    ('lastEdited' in node && isNumber(node.lastEdited)) ||
    ('created' in node && isNumber(node.created)) ||
    ('id' in node && isValidNodeID(node.id))
  )
}

export const isPartialNodeType = <T extends string & NodeType>(
  node: unknown,
  type: T
): node is Node<T> => isPartialNode(node) && 'type' in node && node.type === type
