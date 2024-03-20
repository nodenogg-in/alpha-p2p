import { type NodeReference } from '@nodenogg.in/schema';
export declare const getNodesByType: <T extends keyof import("@nodenogg.in/schema").NodeMap | undefined = undefined>(nodes: NodeReference[], type?: T | undefined) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[];
//# sourceMappingURL=query.d.ts.map