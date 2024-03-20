import type { ViewConfig } from './api';
import type { MicrocosmAPI } from '../api/MicrocosmAPI';
export declare const spatial: <M extends MicrocosmAPI>(api: M, { id, persist }: ViewConfig) => Promise<any>;
export type SpatialView = ReturnType<typeof spatial>;
//# sourceMappingURL=spatial-view.d.ts.map