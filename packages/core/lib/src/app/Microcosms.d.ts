import { NiceMap } from '@nodenogg.in/utils';
import type { MicrocosmAPI, MicrocosmEntryRequest } from '..';
import type { MicrocosmAPIFactory } from '../api/api';
export declare class Microcosms<M extends MicrocosmAPI> {
    factory: MicrocosmAPIFactory<M>;
    readonly microcosms: NiceMap<string, M>;
    constructor(factory: MicrocosmAPIFactory<M>);
    register: (config: MicrocosmEntryRequest) => Promise<M>;
    delete: (microcosm_uri: string) => Promise<void>;
    dispose: () => Promise<void>;
}
//# sourceMappingURL=Microcosms.d.ts.map