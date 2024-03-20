import { NiceMap } from '@nodenogg.in/utils';
import type { MicrocosmAPI } from '../../api/MicrocosmAPI';
import type { MicrocosmViews, View } from '../../views';
export declare class Views<M extends MicrocosmAPI, V extends MicrocosmViews<M>> {
    private readonly v;
    readonly defaultView: keyof V;
    readonly persist?: boolean | undefined;
    protected readonly microcosmViews: NiceMap<string, NiceMap<string, View<string>>>;
    readonly create: { [K in keyof V]: (microcosm: M, id: string) => Promise<ReturnType<V[K]>>; };
    readonly types: (keyof V)[];
    constructor(v: V, defaultView?: keyof V, persist?: boolean | undefined);
    register: <K extends keyof V, R = ReturnType<V[K]>>(type: K, microcosm: M, id: string) => Promise<R>;
    remove: (microcosm_uri: string, id: string) => Promise<void>;
    dispose: () => Promise<void>;
}
//# sourceMappingURL=Views.d.ts.map