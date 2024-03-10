import {
  Microcosms,
  type MicrocosmFactory,
  Microcosm,
  APP_NAME,
  SCHEMA_VERSION,
  MicrocosmAPI
} from '../sync'
import { Instance } from './Instance'
import { version } from '../../package.json'
import { TelemetryOptions } from './state/Telemetry'

type CreateApp<M extends Microcosm<MicrocosmAPI>> = {
  createMicrocosm: MicrocosmFactory<M>
  telemetry?: TelemetryOptions
}
/* 
  Creates an app instance
*/
export const createApp = <M extends Microcosm<MicrocosmAPI>>({
  createMicrocosm,
  telemetry
}: CreateApp<M>) => {
  try {
    Instance.init({ telemetry })
    Instance.telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ ${APP_NAME} app v${version}, schema v${SCHEMA_VERSION}`,
      level: 'status'
    })

    const api = new Microcosms<M>(createMicrocosm)

    const dispose = () => {
      api.dispose()
      Instance.session.dispose(),
        Instance.ui.dispose(),
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
