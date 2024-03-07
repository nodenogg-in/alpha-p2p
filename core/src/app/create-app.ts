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
  log = false
}: {
  createMicrocosm: MicrocosmFactory<M>
  log?: boolean
}) => {
  try {
    Instance.telemetry.log = log
    Instance.telemetry.add({
      name: 'createApp',

      message: `＼(^‿^)／ ${APP_NAME} app v${version}, schema v${SCHEMA_VERSION}`,
      level: 'status'
    })
    const api = new Microcosms<M>(createMicrocosm)

    return {
      telemetry: Instance.telemetry,
      session: Instance.session,
      ui: Instance.ui,
      api
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

export const getPersistenceName = (name: string[]) => [APP_NAME, SCHEMA_VERSION.toString(), ...name]
