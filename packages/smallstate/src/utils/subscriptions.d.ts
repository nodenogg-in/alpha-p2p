export type Unsubscribe = () => void;
export type Subscription<T extends any = any> = (value: T) => void;
/**
 * Creates a managed list of subscriptions and unsubscribe functions
 */
export declare const createSubscriptions: () => Subscriptions;
export type Subscriptions = {
    add: (...sub: Subscription[]) => Unsubscribe;
    dispose: () => void;
    delete: (sub: Subscription) => void;
    each: (value: any) => void;
};
/**
 * Creates a managed list of subscriptions grouped by topic
 */
export declare const createTopicSubscriptions: <T extends string = string>() => TopicSubscriptions<T>;
export type TopicSubscriptions<T extends string> = {
    add: (topic: T, ...sub: Subscription[]) => Unsubscribe;
    dispose: () => void;
    each: (topic: T, value: any) => void;
};
//# sourceMappingURL=subscriptions.d.ts.map