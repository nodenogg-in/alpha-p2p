import entity, {
  EntityDataType,
  EntityLocation,
  EntityPointer,
  type Entity
} from './schema/entity.schema'
import identity, { type Identity, type IdentityUUID } from './schema/identity.schema'
import microcosm, { type Microcosm, type MicrocosmUUID } from './schema/microcosm.schema'
import { NNError, collectNNErrors, isNNError } from './log'

export {
  entity,
  type Entity,
  identity,
  type Identity,
  type IdentityUUID,
  type EntityLocation,
  type EntityPointer,
  type EntityDataType,
  microcosm,
  type Microcosm,
  type MicrocosmUUID
}
export { NNError, isNNError, collectNNErrors }
export { MicrocosmAPI, type MicrocosmAPIConfig, type MicrocosmAPIState } from './api/MicrocosmAPI'
export type { MicrocosmAPIFactory } from './api/types'
export { MAX_CHARACTER_COUNT } from './api/constants'
