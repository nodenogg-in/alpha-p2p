import type { PersistenceName } from '@nodenogg.in/state'
import { type MicrocosmAPI, Microcosms, MicrocosmAPIFactory } from '../.'
import { Instance } from './Instance'
import type { Session } from './state/Session'
import type { Telemetry, TelemetryOptions } from './state/Telemetry'
import type { UI } from './state/UI'
import type { Views } from '../view/api'

export type NodenogginApp<M extends MicrocosmAPI, V extends Views<M>> = {
  view: <K extends keyof V>(key: K) => V[K]
  telemetry: Telemetry
  session: Session
  ui: UI
  api: Microcosms<M>
  namespace: (name: PersistenceName) => PersistenceName
  dispose: () => Promise<void>
}

type CreateApp<M extends MicrocosmAPI, V extends Views<M>> = {
  views: V
  createMicrocosmAPI: MicrocosmAPIFactory<M>
  telemetry?: TelemetryOptions
}
/* 
  Creates an app instance
*/
export const createApp = <M extends MicrocosmAPI, V extends Views<M>>({
  views,
  createMicrocosmAPI,
  telemetry
}: CreateApp<M, V>): NodenogginApp<M, V> => {
  try {
    Instance.init({ telemetry })
    Instance.telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ ${Instance.appName} app v${Instance.appVersion}, schema v${Instance.schemaVersion}`,
      level: 'status'
    })

    const api = new Microcosms<M>(createMicrocosmAPI)

    const view = <K extends keyof V>(key: K) => views[key]

    const dispose = async () => {
      await api.dispose()
      await Instance.session.dispose()
      await Instance.ui.dispose()
      Instance.telemetry.log({
        name: 'dispose',
        message: 'Disposing app',
        level: 'status'
      })
      await Instance.telemetry.dispose()
    }

    return {
      view,
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
