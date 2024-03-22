import { type Input } from 'valibot';
export declare const exportJWTKeyPair: () => Promise<{
    privateKey: JsonWebKey;
    publicKey: JsonWebKey;
}>;
export declare const importJWTKeyPair: (keyData: JWTKeyPair) => Promise<{
    privateKey: CryptoKey;
    publicKey: CryptoKey;
}>;
export declare const signData: (privateKey: CryptoKey, data: object | string) => Promise<string>;
export declare const verifySignature: (publicKey: CryptoKey, signature: string, data: object | string) => Promise<boolean>;
declare const JWTKeyPairSchema: import("valibot").ObjectSchema<{
    privateKey: import("valibot").ObjectSchema<import("valibot").PartialObjectEntries<{
        alg: import("valibot").StringSchema<string>;
        d: import("valibot").StringSchema<string>;
        dp: import("valibot").StringSchema<string>;
        dq: import("valibot").StringSchema<string>;
        e: import("valibot").StringSchema<string>;
        ext: import("valibot").BooleanSchema<boolean>;
        key_ops: import("valibot").ArraySchema<import("valibot").StringSchema<string>, string[]>;
        kty: import("valibot").StringSchema<string>;
        n: import("valibot").StringSchema<string>;
        p: import("valibot").StringSchema<string>;
        q: import("valibot").StringSchema<string>;
        qi: import("valibot").StringSchema<string>;
    }>, undefined, {
        alg?: string | undefined;
        d?: string | undefined;
        dp?: string | undefined;
        dq?: string | undefined;
        e?: string | undefined;
        ext?: boolean | undefined;
        key_ops?: string[] | undefined;
        kty?: string | undefined;
        n?: string | undefined;
        p?: string | undefined;
        q?: string | undefined;
        qi?: string | undefined;
    }>;
    publicKey: import("valibot").ObjectSchema<import("valibot").PartialObjectEntries<{
        alg: import("valibot").StringSchema<string>;
        e: import("valibot").StringSchema<string>;
        ext: import("valibot").BooleanSchema<boolean>;
        key_ops: import("valibot").ArraySchema<import("valibot").StringSchema<string>, string[]>;
        kty: import("valibot").StringSchema<string>;
        n: import("valibot").StringSchema<string>;
    }>, undefined, {
        alg?: string | undefined;
        e?: string | undefined;
        ext?: boolean | undefined;
        key_ops?: string[] | undefined;
        kty?: string | undefined;
        n?: string | undefined;
    }>;
}, undefined, {
    privateKey: {
        alg?: string | undefined;
        d?: string | undefined;
        dp?: string | undefined;
        dq?: string | undefined;
        e?: string | undefined;
        ext?: boolean | undefined;
        key_ops?: string[] | undefined;
        kty?: string | undefined;
        n?: string | undefined;
        p?: string | undefined;
        q?: string | undefined;
        qi?: string | undefined;
    };
    publicKey: {
        alg?: string | undefined;
        e?: string | undefined;
        ext?: boolean | undefined;
        key_ops?: string[] | undefined;
        kty?: string | undefined;
        n?: string | undefined;
    };
}>;
type JWTKeyPair = Input<typeof JWTKeyPairSchema>;
export {};
//# sourceMappingURL=crypto.d.ts.map