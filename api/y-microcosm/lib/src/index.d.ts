import type { MicrocosmAPIFactory } from '@nodenogg.in/core';
import type { ProviderFactory } from './provider';
import { YMicrocosmAPI } from './YMicrocosmAPI';
export type { YMicrocosmAPI } from './YMicrocosmAPI';
export { createWebRTCProvider } from './provider';
export type Options = {
    provider: ProviderFactory;
};
export declare const createYMicrocosmAPI: ({ provider }: Options) => MicrocosmAPIFactory<YMicrocosmAPI>;
//# sourceMappingURL=index.d.ts.map