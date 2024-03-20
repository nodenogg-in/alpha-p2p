import type { EditableMicrocosmAPI } from './EditableMicrocosmAPI';
import type { MicrocosmAPI, MicrocosmAPIConfig } from './MicrocosmAPI';
export type MicrocosmAPIFactory<M extends MicrocosmAPI = MicrocosmAPI> = (args: MicrocosmAPIConfig) => M;
export declare const isEditable: (api: object) => api is EditableMicrocosmAPI;
//# sourceMappingURL=api.d.ts.map