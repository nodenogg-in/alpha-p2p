import { Doc } from 'yjs';
import { ObservableV2 as Observable } from 'lib0/observable';
export declare const PREFERRED_TRIM_SIZE = 500;
type Timeout = ReturnType<typeof setTimeout>;
type UpdatesCallback = (store: IDBObjectStore) => void;
export declare const fetchUpdates: (idbPersistence: IndexedDBPersistence, beforeApplyUpdatesCallback?: UpdatesCallback, afterApplyUpdatesCallback?: UpdatesCallback) => Promise<IDBObjectStore>;
/**
 * @param {IndexedDBPersistence} idbPersistence
 * @param {boolean} forceStore
 */
export declare const storeState: (idbPersistence: IndexedDBPersistence, forceStore?: boolean) => Promise<void>;
/**
 * @param {string} name
 */
export declare const clearDocument: (name: string) => Promise<any>;
/**
 * @extends Observable<string>
 */
export declare class IndexedDBPersistence extends Observable<any> {
    name: string;
    doc: Doc;
    _dbref: number;
    _dbsize: number;
    _destroyed: boolean;
    db: IDBDatabase;
    _db: Promise<IDBDatabase>;
    synced: boolean;
    whenSynced: Promise<unknown>;
    _storeTimeoutId: Timeout | null;
    _storeTimeout: number;
    constructor(name: string, doc: Doc);
    _storeUpdate: (update: string | number | ArrayBuffer | Date, origin?: IndexedDBPersistence) => void;
    destroy: () => Promise<void>;
    /**
     * Destroys this instance and removes all data from indexeddb.
     *
     * @return {Promise<void>}
     */
    clearData: () => Promise<void>;
    /**
     * @param {String | number | ArrayBuffer | Date} key
     * @return {Promise<String | number | ArrayBuffer | Date | any>}
     */
    get: (key: string) => Promise<string | number | ArrayBuffer | Date | any>;
    /**
     * @param {String | number | ArrayBuffer | Date} key
     * @param {String | number | ArrayBuffer | Date} value
     * @return {Promise<String | number | ArrayBuffer | Date>}
     */
    set: <T extends string | number | boolean | ArrayBuffer | Date>(key: string, value: T) => Promise<T>;
    /**
     * @param {String | number | ArrayBuffer | Date} key
     * @return {Promise<undefined>}
     */
    del: (key: string) => Promise<any>;
}
export {};
//# sourceMappingURL=IndexedDBPersistence.d.ts.map