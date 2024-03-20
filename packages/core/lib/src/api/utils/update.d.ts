import { type DistributiveOmit } from '@nodenogg.in/utils';
import { type Node, type NodeType } from '@nodenogg.in/schema';
export type NewNode<T extends string | undefined = undefined> = DistributiveOmit<Node<T>, 'lastEdited'>;
export type NodeUpdate<T extends NodeType> = Partial<DistributiveOmit<Node<T>, 'lastEdited'>>;
export declare const isNodeUpdate: <T extends keyof import("@nodenogg.in/schema").NodeMap>(u: Partial<DistributiveOmit<Node<T>, "lastEdited">> | Partial<DistributiveOmit<Node<T>, "lastEdited">>[]) => u is Partial<DistributiveOmit<Node<T>, "lastEdited">>;
export declare const updateNode: <T extends "html" | "connection" | "emoji">(existing: Node<T>, update: Partial<DistributiveOmit<Node<T>, "lastEdited">>) => Promise<Node<T>>;
export declare const createNode: (newNode: NewNode) => Promise<Node>;
export type NodePatch<T extends NodeType> = (node: Node<T>) => NodeUpdate<T>;
//# sourceMappingURL=update.d.ts.map