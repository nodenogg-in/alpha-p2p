import type { ProviderFactory } from '.';
export type WebRTCServers = Record<string, string> & {
    production: string;
};
export declare const createWebRTCProvider: (url: string) => ProviderFactory;
//# sourceMappingURL=create-webrtc-provider.d.ts.map