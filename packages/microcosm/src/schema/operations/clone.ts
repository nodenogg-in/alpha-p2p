import { clone as c } from '@figureland/typekit/clone'
import { createNodeID, createTimestamp } from '../uuid.schema'
import { type Node, type NodeType } from '../node.schema'

export const clone = <T extends NodeType, N extends Node<T>>(node: N): N => {
  const created = createTimestamp()
  return {
    ...c(node),
    id: createNodeID(),
    created,
    lastEdited: created
  }
}
