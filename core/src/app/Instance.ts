import { APP_NAME, SCHEMA_VERSION } from '../sync/constants'
import { Session } from './state/Session'
import { Telemetry, TelemetryOptions } from './state/Telemetry'
import { UI } from './state/UI'

export const getPersistenceName = (name: string[]) => [APP_NAME, SCHEMA_VERSION.toString(), ...name]

type InstanceOptions = {
  telemetry?: TelemetryOptions
}

export namespace Instance {
  export let telemetry: Telemetry
  export let ui: UI
  export let session: Session

  export const init = ({ telemetry: telemetryOptions }: InstanceOptions = {}) => {
    telemetry = new Telemetry(telemetryOptions)
    ui = new UI()
    session = new Session()
  }
}
