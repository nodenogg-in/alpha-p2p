import { State } from '@nodenogg.in/state';
import { Output } from 'valibot';
import { MicrocosmReference } from '@nodenogg.in/schema';
import { User } from './User';
declare const stateSchema: import("valibot").ObjectSchema<{
    active: import("valibot").OptionalSchema<import("valibot").StringSchema<string>, undefined, string | undefined>;
    microcosms: import("valibot").MapSchema<import("valibot").StringSchema<string>, import("valibot").ObjectSchema<{
        microcosm_uri: import("valibot").StringSchema<string>;
        lastAccessed: import("valibot").NumberSchema<number>;
        password: import("valibot").OptionalSchema<import("valibot").StringSchema<string>, undefined, string | undefined>;
        view: import("valibot").OptionalSchema<import("valibot").StringSchema<string>, undefined, string | undefined>;
    }, undefined, {
        microcosm_uri: string;
        lastAccessed: number;
        password?: string | undefined;
        view?: string | undefined;
    }>, import("valibot").MapOutput<import("valibot").StringSchema<string>, import("valibot").ObjectSchema<{
        microcosm_uri: import("valibot").StringSchema<string>;
        lastAccessed: import("valibot").NumberSchema<number>;
        password: import("valibot").OptionalSchema<import("valibot").StringSchema<string>, undefined, string | undefined>;
        view: import("valibot").OptionalSchema<import("valibot").StringSchema<string>, undefined, string | undefined>;
    }, undefined, {
        microcosm_uri: string;
        lastAccessed: number;
        password?: string | undefined;
        view?: string | undefined;
    }>>>;
}, undefined, {
    microcosms: import("valibot").MapOutput<import("valibot").StringSchema<string>, import("valibot").ObjectSchema<{
        microcosm_uri: import("valibot").StringSchema<string>;
        lastAccessed: import("valibot").NumberSchema<number>;
        password: import("valibot").OptionalSchema<import("valibot").StringSchema<string>, undefined, string | undefined>;
        view: import("valibot").OptionalSchema<import("valibot").StringSchema<string>, undefined, string | undefined>;
    }, undefined, {
        microcosm_uri: string;
        lastAccessed: number;
        password?: string | undefined;
        view?: string | undefined;
    }>>;
    active?: string | undefined;
}>;
export type SessionState = Output<typeof stateSchema>;
export type MicrocosmEntryRequest = {
    microcosm_uri: string;
    view?: string;
    password?: string;
};
export declare class Session extends State<SessionState> {
    user: User;
    ready: import("@nodenogg.in/state").Signal<boolean>;
    constructor();
    removeReference: (microcosm_uri: string) => void;
    registerReference: ({ microcosm_uri, view, password }: MicrocosmEntryRequest) => MicrocosmReference;
    getReference: (microcosm_uri: string) => MicrocosmReference | false;
    isActive: (microcosm_uri: string) => boolean;
    setActive: (microcosm_uri: string) => void;
}
export {};
//# sourceMappingURL=Session.d.ts.map