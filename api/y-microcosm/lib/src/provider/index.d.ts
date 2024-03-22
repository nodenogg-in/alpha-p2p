import type { Awareness } from 'y-protocols/awareness';
import type { YMicrocosmDoc } from '../YMicrocosmDoc';
export interface Provider {
    awareness: Awareness;
    destroy: () => void;
    disconnect: () => void;
    connect: () => void;
    shouldConnect: boolean;
    signalingUrls: string[];
}
export type ProviderFactory<T extends Provider = Provider> = (Microcosm_id: string, doc: YMicrocosmDoc, password?: string) => Promise<T>;
export * from './create-webrtc-provider';
//# sourceMappingURL=index.d.ts.map