import { type MicrocosmAPI, type MicrocosmAPIFactory, Microcosms, MicrocosmViews } from '../.';
import type { TelemetryOptions } from './state/Telemetry';
import { Views } from './state/Views';
export declare const createApp: <M extends MicrocosmAPI, V extends MicrocosmViews<M>>({ views: viewFactories, defaultView, api, telemetry }: {
    views: V;
    defaultView?: keyof V | undefined;
    api: MicrocosmAPIFactory<M>;
    telemetry?: TelemetryOptions | undefined;
}) => {
    microcosms: Microcosms<M>;
    telemetry: import("./state/Telemetry").Telemetry;
    session: import("./state/Session").Session;
    ui: import("./state/UI").UI;
    views: Views<M, V>;
    dispose: () => Promise<void>;
};
//# sourceMappingURL=create-app.d.ts.map