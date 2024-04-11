import type { EditableMicrocosmAPI } from './EditableMicrocosmAPI'
import type { MicrocosmAPI, MicrocosmAPIConfig } from './MicrocosmAPI'

export interface BaseTelemetry {}

export type MicrocosmAPIFactory<
  M extends MicrocosmAPI = MicrocosmAPI,
  T extends BaseTelemetry = BaseTelemetry
> = (args: MicrocosmAPIConfig, telemetry?: T) => Promise<M>

export const isEditableAPI = (api: object): api is EditableMicrocosmAPI => 'leave' in api
