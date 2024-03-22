import { type MicrocosmAPIConfig, EditableMicrocosmAPI } from '@nodenogg.in/core';
import type { ProviderFactory } from './provider';
export declare class YMicrocosmAPI extends EditableMicrocosmAPI {
    private readonly providerFactory?;
    private readonly doc;
    private persistence;
    private provider;
    /**
     * Creates a new Microcosm that optionally syncs with peers, if a provider is specified.
     */
    constructor(config: MicrocosmAPIConfig, providerFactory?: ProviderFactory | undefined);
    updatePassword: (password: string) => Promise<void>;
    private createPersistence;
    /**
     * Triggered when the {@link MicrocosmAPI} is ready
     */
    private onReady;
    /**
     * Triggered when the {@link MicrocosmAPI} is no longer ready
     */
    private offReady;
    private createProvider;
    private handleAwareness;
    /**
     * Connects this Microcosm's {@link Y.Doc} instance to its {@link Provider}
     */
    private connect;
    /**
     * Disconnects this Microcosm's {@link Y.Doc} instance from its {@link Provider}
     */
    private disconnect;
    /**
     * Erases this Microcosm's locally stored content and disposes this instance
     */
    clearPersistence: (reset?: boolean) => void;
    /**
     * Creates a new {@link Node}
     */
    private createNode;
    /**
     * Creates a new {@link Node}
     */
    create: EditableMicrocosmAPI['create'];
    /**
     * Updates one or more {@link Node}s
     */
    update: EditableMicrocosmAPI['update'];
    patch: EditableMicrocosmAPI['patch'];
    /**
     * Deletes an array of {@link Node}s
     */
    delete: EditableMicrocosmAPI['delete'];
    /**
     * Deletes all the user's {@link Node}s.
     */
    deleteAll: () => void;
    nodes: EditableMicrocosmAPI['nodes'];
    node: EditableMicrocosmAPI['node'];
    getCollections: EditableMicrocosmAPI['getCollections'];
    /**
     * Subscribes to a collection
     */
    subscribeToCollection: EditableMicrocosmAPI['subscribeToCollection'];
    getCollection: EditableMicrocosmAPI['getCollection'];
    /**
     * Joins the Microcosm, publishing identity status to connected peers
     */
    join: EditableMicrocosmAPI['join'];
    /**
     * Leaves the Microcosm, publishing identity status to connected peers
     */
    leave: EditableMicrocosmAPI['leave'];
    /**
     * Destroys the Microcosm's content and disposes this instance
     */
    destroy: () => void;
    undo: EditableMicrocosmAPI['undo'];
    redo: EditableMicrocosmAPI['redo'];
    boxes: EditableMicrocosmAPI['boxes'];
}
//# sourceMappingURL=YMicrocosmAPI.d.ts.map