import type { ViewType } from '../../schema'
import { Microcosm } from './Microcosm'
import type { EditableMicrocosmAPI, ReadonlyMicrocosmAPI  } from './MicrocosmAPI'

export type MicrocosmAPI = ReadonlyMicrocosmAPI | EditableMicrocosmAPI

export type MicrocosmConfig = {
  microcosm_uri: string
  view?: ViewType
  user_id: string
  password?: string
}

export type MicrocosmFactory<M extends Microcosm = Microcosm> = (args: MicrocosmConfig) => M

export type { EditableMicrocosmAPI, ReadonlyMicrocosmAPI }
