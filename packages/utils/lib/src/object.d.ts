type ValueOf<T> = T[keyof T];
type Entries<T> = [keyof T, ValueOf<T>][];
export declare const entries: <T extends object>(obj: T) => Entries<T>;
export declare const keys: <T extends object>(obj: T) => (keyof T)[];
export declare const values: <T extends object>(obj: T) => ValueOf<T>[];
export declare const assign: <T extends object, U extends object>(obj: T, ...objs: U[]) => any;
export declare const is: <T>(a: T, b: T) => boolean;
export declare const has: <O extends unknown, K extends unknown>(o: O, k: K) => boolean;
export declare const sortMapToArray: <O extends object, K extends keyof O & string>(map: Map<string, O>, prop: K) => O[];
export declare class NiceMap<K, V> extends Map<K, V> {
    getOrSet: <Value extends V>(key: K, fn: (() => Value) | (() => Promise<Value>)) => Value;
}
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export type WithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
export type Modify<T, R> = Omit<T, keyof R> & R;
export {};
//# sourceMappingURL=object.d.ts.map