export type PersistenceStatus = {
    available: number;
    canPersist: boolean;
};
export declare const defaultPersistence: () => PersistenceStatus;
export declare const getPersistenceStatus: () => Promise<PersistenceStatus>;
//# sourceMappingURL=persistence.d.ts.map