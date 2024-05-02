import { clone as c } from '@figureland/typekit/clone'
import { createNodeID, createTimestamp } from './uuid'
import type { Node, NodeType } from '../schema/node.schema'

export const clone = <T extends NodeType, N extends Node<T>>(node: N): N => {
  const created = createTimestamp()
  return {
    ...c(node),
    id: createNodeID(),
    created,
    lastEdited: created
  }
}
