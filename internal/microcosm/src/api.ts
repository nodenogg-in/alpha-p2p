import type { Telemetry } from '@nodenogg.in/framework'
import type { EditableMicrocosmAPI } from './EditableMicrocosmAPI'
import type { MicrocosmAPI, MicrocosmAPIConfig } from './MicrocosmAPI'

export type MicrocosmAPIFactory<M extends MicrocosmAPI = MicrocosmAPI> = (
  args: MicrocosmAPIConfig,
  telemetry?: Telemetry
) => Promise<M>

export const isEditableAPI = (api: object): api is EditableMicrocosmAPI => 'leave' in api
