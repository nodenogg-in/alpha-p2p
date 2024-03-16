import { type MicrocosmAPI, Microcosms, MicrocosmAPIFactory } from '../sync'
import { Instance } from './Instance'
import { Session } from './state/Session'
import type { Telemetry, TelemetryOptions } from './state/Telemetry'
import { UI } from './state/UI'

export type NodenogginApp<M extends MicrocosmAPI> = {
  telemetry: Telemetry
  session: Session
  ui: UI
  api: Microcosms<M>
  namespace: (name: string[]) => string[]
  dispose: () => void
}

/* 
  Creates an app instance
*/
export const createApp = <M extends MicrocosmAPI>({
  createMicrocosmAPI,
  telemetry
}: {
  createMicrocosmAPI: MicrocosmAPIFactory<M>
  telemetry?: TelemetryOptions
}): NodenogginApp<M> => {
  try {
    Instance.init({ telemetry })
    Instance.telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ ${Instance.appName} app v${Instance.appVersion}, schema v${Instance.schemaVersion}`,
      level: 'status'
    })

    const api = new Microcosms<M>(createMicrocosmAPI)

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
      namespace: Instance.getPersistenceName,
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
