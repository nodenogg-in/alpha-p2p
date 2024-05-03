import type { DistributiveOmit } from '@figureland/typekit'
import type { NodeType, PartialNode } from '../schema/node.schema'
import { type NodeCreatePayload, create } from './create'

export const partialNodeFields: {
  [K in NodeType]: DistributiveOmit<PartialNode<K>, 'type'>
} = {
  html: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    body: ''
  },
  emoji: {
    body: ''
  },
  connection: {
    body: ''
  },
  ghost: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  region: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
}

export type NodePartialCreatePayload<T extends NodeType> = PartialNode<T> & {
  type: T
}

export const createFromPartial = <T extends NodeType>(node: NodePartialCreatePayload<T>) =>
  create({ ...partialNodeFields[node.type], ...node } as unknown as NodeCreatePayload<T>)
