import type { IdentityWithStatus, Identity_ID, Node, NodeReference, NodeType, Node_ID } from '@nodenogg.in/schema';
import { type BoxReference } from '@nodenogg.in/spatialkit';
import { type Signal, State } from '@nodenogg.in/state';
export type MicrocosmAPIConfig = {
    microcosm_uri: string;
    view?: string;
    user_id: string;
    password?: string;
};
export type MicrocosmAPIEvents = {
    status: {
        ready: boolean;
        connected: boolean;
    };
    identities: IdentityWithStatus[];
    collections: string[];
    active: boolean;
};
export declare class MicrocosmAPI extends State<MicrocosmAPIEvents> {
    readonly microcosm_uri: string;
    protected password?: string;
    protected readonly user_id: string;
    /**
     * Creates a new Microcosm that optionally syncs with peers, if a provider is specified.
     */
    constructor({ microcosm_uri, user_id, password }: MicrocosmAPIConfig);
    node: <T extends NodeType>(node_id: Node_ID, type?: T) => Node<T> | undefined;
    nodes: <T extends NodeType | undefined = undefined>(type?: T) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[];
    getCollections: () => Identity_ID[];
    subscribeToCollection: (user_id: Identity_ID) => Signal<NodeReference[]>;
    getCollection: (user_id: Identity_ID) => NodeReference[];
    boxes: () => BoxReference[];
    isActive: () => boolean;
}
//# sourceMappingURL=MicrocosmAPI.d.ts.map