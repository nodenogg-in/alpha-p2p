import { type NodePatch, type NodeUpdate } from '@nodenogg.in/core';
import type { Unsubscribe } from '@nodenogg.in/smallstate';
import { type Node, type NodeReference, Node_ID, Identity_ID } from '@nodenogg.in/schema';
import { Doc, Map as YMap } from 'yjs';
export declare class YMicrocosmDoc extends Doc {
    private collections;
    collection: YMap<Node>;
    private cached;
    private undoManager;
    init: (user_id: string) => YMicrocosmDoc;
    private getCollection;
    getCollections: () => Identity_ID[];
    collectionToNodes: (user_id: Identity_ID) => NodeReference[];
    /**
     * Updates a single {@link Node}
     */
    update: <T extends keyof import("@nodenogg.in/schema").NodeMap>(node_id: Node_ID, update: Partial<import("@nodenogg.in/utils/*").DistributiveOmit<Node<T>, "lastEdited">>) => Promise<void>;
    patch: <T extends keyof import("@nodenogg.in/schema").NodeMap>(node_id: Node_ID, patch: NodePatch<T>) => void;
    /**
     * Retrieves and caches all {@link Node}s in the {@link Microcosm}
     */
    private getAllNodes;
    /**
     * The latest snapshot of all {@link Node}s in the {@link Microcosm}
     */
    nodes: () => NodeReference[];
    /**
     * Subscribes to a list of all {@link Node}s in the {@link Microcosm}
     */
    subscribeAll: (fn: (data: NodeReference[]) => void) => Unsubscribe;
    /**
     * Subscribes to a list of ids of collections of {@link Node}s
     */
    subscribeToCollections: (fn: (data: string[]) => void) => Unsubscribe;
    /**
     * Subscribes to a user's collection of {@link Node}s
     */
    subscribeToCollection: (user_id: Identity_ID, fn: (nodes: [Node_ID, Node][]) => void) => Unsubscribe;
    dispose: () => void;
    /**
     * Undoes the previous action within this user's list of {@link Node}s (uses {@link UndoManager})
     */
    undo: () => void;
    /**
     * Redoes the previous action within this user's list of {@link Node}s (uses {@link UndoManager})
     */
    redo: () => void;
}
//# sourceMappingURL=YMicrocosmDoc.d.ts.map