import { Session } from './state/Session'
import { Telemetry } from './state/Telemetry'
import { UI } from './state/UI'

export namespace Instance {
  export const telemetry = new Telemetry()
  export const ui = new UI()
  export const session = new Session()
}
