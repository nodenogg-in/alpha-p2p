import type { DistributiveOmit } from '@figureland/typekit'
import type { LatestSchemaVersions, Node, NodeType } from '../schema/node.schema'
import type { NodeCreatePayload } from './create'
import type { Version } from '../schema/nodes/schema'
import type { ReadonlyNodeFields } from '../schema/nodes/shared'

/* 
Provides a partial record of all the fields that are specific to each node type
*/
export type PartialNodeFields<T extends NodeType> = DistributiveOmit<
  Partial<Version<LatestSchemaVersions[T], Node<T>>>,
  ReadonlyNodeFields
> & { type: T }

export type PartialNodeFieldsRecord = {
  [K in NodeType]: DistributiveOmit<PartialNodeFields<K>, 'type'>
}

/* 
For each node type, here are a set of defaults fields
*/
export const partialNodeFields: PartialNodeFieldsRecord = {
  html: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
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

export type NodePartialCreatePayload<T extends NodeType> = PartialNodeFields<T> & {
  type: T
}

export const fromPartial = <T extends NodeType>(
  node: NodePartialCreatePayload<T>
): NodeCreatePayload<T> =>
  ({
    ...partialNodeFields[node.type],
    ...node
  }) as unknown as NodeCreatePayload<T>
