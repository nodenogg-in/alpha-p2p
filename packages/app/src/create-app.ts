import { type MicrocosmAPI, type MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import { Microcosms } from './state/Microcosms'
import { Telemetry, type TelemetryOptions } from './state/Telemetry'
import { Instance } from './Instance'
import { MicrocosmViews, ViewManager } from './state/ViewManager'
import { signal } from '@nodenogg.in/state'

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
    const ready = signal(() => false)

    Instance.init({ telemetry: new Telemetry(telemetry) })
    Instance.telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ ${Instance.appName} app v${Instance.appVersion}, schema v${Instance.schemaVersion}`,
      level: 'status'
    })

    const microcosms = new Microcosms<M>(api)
    const views = new ViewManager<M, V>(viewFactories, defaultView, true)

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
      ready,
      microcosms,
      telemetry: Instance.telemetry,
      session: Instance.session,
      ui: Instance.ui,
      views,
      dispose
    }
  } catch (error) {
    console.log(error)
    throw Instance.telemetry?.catch({
      name: 'createApp',
      message: 'Could not create app instance',
      level: 'fail',
      error
    })
  }
}
