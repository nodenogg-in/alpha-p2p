import { type Subscription, type Unsubscribe } from './subscriptions';
export type Events<S extends Record<string, any>, K extends string & keyof S = string & keyof S> = {
    subscribe: (key: K, sub: Subscription) => Unsubscribe;
    subscribeAll: (sub: Subscription<S>) => Unsubscribe;
    subscribeMany: <TEventName extends K>(listeners: Record<TEventName, (eventArg: S[TEventName]) => void>) => Unsubscribe;
    emit: <Key extends K = K>(key: Key, value: S[Key]) => void;
    dispose: () => void;
};
/**
 * Creates a new event emitter
 */
export declare const createEvents: <S extends Record<string, any>, K extends string & keyof S = string & keyof S>() => Events<S, K>;
//# sourceMappingURL=events.d.ts.map