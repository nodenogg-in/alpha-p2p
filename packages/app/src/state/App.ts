import { SCHEMA_VERSION } from '@nodenogg.in/microcosm'
import type { PersistenceName } from '@nodenogg.in/state'
import { APP_NAME, APP_VERSION } from '../constants'
import { Session } from './Session'
import { Telemetry, type TelemetryOptions } from './Telemetry'
import { UI } from './UI'

type InstanceOptions = {
  telemetry?: TelemetryOptions
}

export class App {
  telemetry: Telemetry
  ui: UI
  session: Session

  appName = APP_NAME
  appVersion = APP_VERSION
  schemaVersion = SCHEMA_VERSION

  init = ({ telemetry: telemetryOptions }: InstanceOptions = {}) => {
    this.ui = new UI()
    this.session = new Session()
    this.telemetry = new Telemetry(telemetryOptions)
  }

  getPersistenceName = (name: PersistenceName) => [
    this.appName,
    this.schemaVersion.toString(),
    ...name
  ]
}
