import { APP_NAME, SCHEMA_VERSION } from '../sync/constants'
import { Session } from './state/Session'
import { Telemetry } from './state/Telemetry'
import { UI } from './state/UI'

export const getPersistenceName = (name: string[]) => [APP_NAME, SCHEMA_VERSION.toString(), ...name]

export namespace Instance {
  export const telemetry = new Telemetry()
  export const ui = new UI()
  export const session = new Session()
}
