import { SCHEMA_VERSION } from '@nodenogg.in/schema'
import { APP_NAME, APP_VERSION } from './constants'
import { Session } from './state/Session'
import { Telemetry, type TelemetryOptions } from './state/Telemetry'
import { UI } from './state/UI'

type InstanceOptions = {
  telemetry?: TelemetryOptions
}

export namespace Instance {
  export let telemetry: Telemetry
  export let ui: UI
  export let session: Session

  export const appName = APP_NAME
  export const appVersion = APP_VERSION
  export const schemaVersion = SCHEMA_VERSION

  export const init = ({ telemetry: telemetryOptions }: InstanceOptions = {}) => {
    session = new Session()
    telemetry = new Telemetry(telemetryOptions)
    ui = new UI()
  }

  export const getPersistenceName = (name: string[]) => [appName, schemaVersion.toString(), ...name]
}
