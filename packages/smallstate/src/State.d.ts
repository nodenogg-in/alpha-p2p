import type { Unsubscribe } from './utils/subscriptions';
import { type LocalStorageValidator } from './utils/local-storage';
import { type SignalObject } from './signal-object';
import type { SignalOptions } from './SignalContext';
export type PersistenceName = string[];
export type PersistenceOptions = {
    name: PersistenceName;
    validate: LocalStorageValidator;
    syncTabs?: boolean;
    interval?: number;
};
export type StateOptions<S extends object = object> = {
    initial: () => S;
    persist?: PersistenceOptions;
    throttle?: number;
    signal?: SignalOptions;
};
export declare class State<S extends object, K extends keyof S = keyof S> {
    signal: SignalObject<S>;
    private subscriptions;
    private persist;
    private lastUpdate;
    private throttle;
    private lastThrottle;
    protected initial: () => S;
    constructor({ initial, persist, throttle, signal: signalOptions }: StateOptions<S>);
    private shouldThrottle;
    private onChange;
    set: (u: Partial<S>, sync?: boolean) => void;
    get: () => S;
    key: <Key extends K = K>(k: Key) => import("./SignalContext").Signal<S[Key]>;
    on: (sub: (value: S) => void) => Unsubscribe;
    dispose: () => Promise<void>;
    use: (...sub: Unsubscribe[]) => Unsubscribe;
    resetInitial: () => void;
}
export declare const isState: (s: any) => s is State<any, string | number | symbol>;
export type StateType<S> = S extends State<infer T> ? T : never;
//# sourceMappingURL=State.d.ts.map