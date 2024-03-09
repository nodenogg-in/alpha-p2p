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

/* 
  Creates an app instance
*/
export const createApp = <M extends Microcosm<MicrocosmAPI>>({
  createMicrocosm,
  logEvents = false
}: {
  createMicrocosm: MicrocosmFactory<M>
  logEvents?: boolean
}) => {
  try {
    Instance.telemetry.logEvents = logEvents
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
    }

    return {
      telemetry: Instance.telemetry,
      session: Instance.session,
      ui: Instance.ui,
      api,
      dispose
    }
  } catch (error) {
    throw Instance.telemetry.throw(error, {
      name: 'createApp',
      message: 'Could not create app instance',
      level: 'fail',
      error
    })
  }
}
