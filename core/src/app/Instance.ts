import { APP_NAME, SCHEMA_VERSION } from '../sync/constants'
import { Session } from './state/Session'
import { Telemetry, type TelemetryOptions } from './state/Telemetry'
import { UI } from './state/UI'
import { User } from './state/User'

type InstanceOptions = {
  telemetry?: TelemetryOptions
}

export namespace Instance {
  export let telemetry: Telemetry
  export let ui: UI
  export let session: Session
  export const appName = APP_NAME
  export const schemaVersion = SCHEMA_VERSION

  export const init = ({ telemetry: telemetryOptions }: InstanceOptions = {}) => {
    session = new Session()
    telemetry = new Telemetry(telemetryOptions)
    ui = new UI()
  }

  export const getPersistenceName = (name: string[]) => [appName, schemaVersion.toString(), ...name]
}
