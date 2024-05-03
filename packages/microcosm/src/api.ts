import type {
  MicrocosmAPI,
  MicrocosmAPIConfig,
  EditableMicrocosmAPI
} from './api/EditableMicrocosmAPI'
import type { Telemetry } from './telemetry'

export type MicrocosmAPIFactory<
  M extends MicrocosmAPI = MicrocosmAPI,
  T extends Telemetry = Telemetry
> = (args: MicrocosmAPIConfig, telemetry?: T) => Promise<M>

export const isEditableAPI = (api: object): api is EditableMicrocosmAPI => 'leave' in api
