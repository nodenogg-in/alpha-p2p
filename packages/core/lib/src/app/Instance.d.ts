import type { PersistenceName } from '@nodenogg.in/state';
import { Session } from './state/Session';
import { Telemetry, type TelemetryOptions } from './state/Telemetry';
import { UI } from './state/UI';
type InstanceOptions = {
    telemetry?: TelemetryOptions;
};
export declare namespace Instance {
    let telemetry: Telemetry;
    let ui: UI;
    let session: Session;
    const appName = "nodenoggin";
    const appVersion: string;
    const schemaVersion = 0;
    const init: ({ telemetry: telemetryOptions }?: InstanceOptions) => void;
    const getPersistenceName: (name: PersistenceName) => string[];
}
export {};
//# sourceMappingURL=Instance.d.ts.map