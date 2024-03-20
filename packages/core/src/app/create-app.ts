import { type MicrocosmAPI, type MicrocosmAPIFactory, Microcosms, MicrocosmViews } from '../.'
import type { TelemetryOptions } from './state/Telemetry'
import { Instance } from './Instance'
import { Views } from './state/Views'

/* 
  Creates an app instance
*/
export const createApp = <M extends MicrocosmAPI, V extends MicrocosmViews<M>>({
  views: viewFactories,
  defaultView,
  api,
  telemetry
}: {
  views: V
  defaultView?: keyof V
  api: MicrocosmAPIFactory<M>
  telemetry?: TelemetryOptions
}) => {
  try {
    Instance.init({ telemetry })
    Instance.telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ ${Instance.appName} app v${Instance.appVersion}, schema v${Instance.schemaVersion}`,
      level: 'status'
    })

    const microcosms = new Microcosms<M>(api)
    const views = new Views<M, V>(viewFactories, defaultView, true)

    const dispose = async () => {
      await microcosms.dispose()
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
      microcosms,
      telemetry: Instance.telemetry,
      session: Instance.session,
      ui: Instance.ui,
      views,
      dispose
    }
  } catch (error) {
    throw Instance.telemetry?.catch({
      name: 'createApp',
      message: 'Could not create app instance',
      level: 'fail',
      error
    })
  }
}
