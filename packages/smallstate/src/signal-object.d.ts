import { type Signal, SignalOptions } from './SignalContext';
import { Subscription, Unsubscribe } from './utils/subscriptions';
export type SignalObject<R extends Record<string, any>, K extends keyof R = keyof R> = {
    key: <K extends keyof R>(key: K) => Signal<R[K]>;
    keys: K[];
    set: (u: Partial<R>, sync?: boolean) => void;
    on: (sub: Subscription<R>) => Unsubscribe;
    get: () => R;
    dispose: () => void;
    use: (...sub: Unsubscribe[]) => void;
};
export declare const signalObject: <R extends Record<string, any>>(r: R, options?: SignalOptions) => SignalObject<R, keyof R>;
//# sourceMappingURL=signal-object.d.ts.map