import {
  type MicrocosmFactory,
  type Microcosm,
  type MicrocosmAPI,
  Microcosms,
  APP_NAME,
  SCHEMA_VERSION,
  APP_VERSION
} from '../sync'
import { Instance } from './Instance'
import type { TelemetryOptions } from './state/Telemetry'

/* 
  Creates an app instance
*/
export const createApp = <M extends Microcosm<MicrocosmAPI>>({
  createMicrocosm,
  telemetry
}: {
  createMicrocosm: MicrocosmFactory<M>
  telemetry?: TelemetryOptions
}) => {
  try {
    Instance.init({ telemetry })
    Instance.telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ ${APP_NAME} app v${APP_VERSION}, schema v${SCHEMA_VERSION}`,
      level: 'status'
    })

    const api = new Microcosms<M>(createMicrocosm)

    const dispose = () => {
      api.dispose()
      Instance.session.dispose()
      Instance.ui.dispose()
      Instance.telemetry.log({
        name: 'dispose',
        message: 'Disposing app',
        level: 'status'
      })
      Instance.telemetry.dispose()
    }

    return {
      telemetry: Instance.telemetry,
      session: Instance.session,
      ui: Instance.ui,
      api,
      dispose
    }
  } catch (error) {
    throw Instance.telemetry.catch({
      name: 'createApp',
      message: 'Could not create app instance',
      level: 'fail',
      error
    })
  }
}
