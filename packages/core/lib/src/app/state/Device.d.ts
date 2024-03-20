import { State } from '@nodenogg.in/state';
import { type PersistenceStatus } from '../persistence';
export type DeviceState = {
    online: boolean;
    persistence: PersistenceStatus;
    safari: boolean;
    chrome: boolean;
    mobile: boolean;
};
export declare class Device extends State<DeviceState> {
    constructor();
    private setOnline;
    private setOffline;
}
//# sourceMappingURL=Device.d.ts.map