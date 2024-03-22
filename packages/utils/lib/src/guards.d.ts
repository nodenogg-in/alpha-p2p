export declare const isBoolean: (n: unknown) => n is boolean;
export declare const isNotNullish: <T = any>(val?: T | null | undefined) => val is T;
export declare const isString: (n: unknown) => n is string;
export declare const isNumber: (n: unknown) => n is number;
export declare const isObject: (n: unknown) => n is object;
export declare const isArray: (n: unknown) => n is unknown[];
export declare const isMap: <K, V>(n: unknown) => n is Map<K, V>;
export declare const isFunction: (n: unknown) => n is Function;
export declare const isSet: <T>(n: unknown) => n is Set<T>;
export declare const isValidURL: (n: unknown) => n is string;
export declare const isNumberLike: (n: unknown) => n is number;
//# sourceMappingURL=guards.d.ts.map