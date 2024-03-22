import { type Merge } from '@nodenogg.in/utils';
import { type Subscription, type Unsubscribe } from './utils/subscriptions';
import { type Equals } from './utils/equals';
export declare const signal: <R>(fn: () => R, { track, equality, merge }?: SignalOptions) => Signal<R>;
export type SignalType<S> = S extends Signal<infer T> ? T : never;
export type Signal<V> = {
    set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>), sync?: boolean) => void;
    on: (sub: Subscription<V>) => Unsubscribe;
    get: () => V;
    dispose: () => void;
    use: (...sub: Unsubscribe[]) => void;
};
export type SignalOptions = {
    track?: boolean;
    equality?: Equals;
    merge?: Merge;
};
//# sourceMappingURL=SignalContext.d.ts.map