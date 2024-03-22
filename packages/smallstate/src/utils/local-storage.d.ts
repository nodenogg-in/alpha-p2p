import type { PersistenceName } from '../State';
import type { Unsubscribe } from './subscriptions';
export type LocalStorageValidator = (v: unknown) => boolean;
/**
 * An internal helper to get a typed, valid value from localStorage
 */
export declare const getLocalStorage: <T>(name: string | PersistenceName, validate: LocalStorageValidator, fallback: () => T) => T;
/**
 * An internal helper to store a variable in localStorage
 */
export declare const setLocalStorage: (name: string | PersistenceName, value: unknown) => void;
export interface LocalStorageOptions<T> {
    name: PersistenceName;
    validate: LocalStorageValidator;
    defaultValue: () => T;
    interval?: number;
}
export declare const listenToLocalStorage: <T>(name: string | PersistenceName, validate: LocalStorageValidator, fn: (v: T) => void) => Unsubscribe;
//# sourceMappingURL=local-storage.d.ts.map