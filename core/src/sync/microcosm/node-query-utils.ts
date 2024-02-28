import type { NodeReference, NodeType } from '../../schema'

export const getNodesByType = <T extends NodeType | undefined = undefined>(
  nodes: NodeReference[],
  type?: T
) => {
  if (!type) {
    return nodes as T extends undefined ? NodeReference[] : never
  } else {
    return nodes.filter((node: NodeReference) => node[1].type === type) as NodeReference<
      typeof type
    >[]
  }
}
