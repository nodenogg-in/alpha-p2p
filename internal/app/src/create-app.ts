import { SCHEMA_VERSION, type MicrocosmAPI, type MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import { Microcosms } from './state/Microcosms'
import { Telemetry, type TelemetryOptions } from './state/Telemetry'
import { MicrocosmViews, ViewManager } from './state/ViewManager'
import { PersistenceName, signal } from '@nodenogg.in/statekit'
import { APP_NAME, APP_VERSION } from '.'
import { Session } from './state/Session'
import { UI } from './state/UI'

export const getPersistenceName = (name: PersistenceName) => [
  APP_NAME,
  `s_${SCHEMA_VERSION.toString()}`,
  ...name
]

// const defaultViews =
/* 
  Creates an app instance
*/
export const createApp = <M extends MicrocosmAPI, V extends MicrocosmViews = MicrocosmViews>({
  views: viewFactories,
  telemetry: telemetryOptions,
  defaultView,
  api
}: {
  views: V
  defaultView?: keyof V
  api: MicrocosmAPIFactory<M>
  telemetry?: TelemetryOptions
}) => {
  const telemetry = new Telemetry()
  try {
    const ready = signal(() => false)

    if (telemetryOptions) {
      telemetry.init(telemetryOptions)
    }
    telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ ${APP_NAME} app v${APP_VERSION}, schema v${SCHEMA_VERSION}`,
      level: 'status'
    })

    const ui = new UI(getPersistenceName(['ui', 'state']))
    const session = new Session(getPersistenceName(['app', 'microcosms']))
    const microcosms = new Microcosms<M>(api, session, telemetry)
    const views = new ViewManager<M, V>(viewFactories, ui, session, defaultView, true)

    const dispose = async () => {
      telemetry.log({
        name: 'dispose',
        message: 'Disposing app',
        level: 'status'
      })
      await microcosms.dispose()
      await session.dispose()
      await ui.dispose()
      await telemetry.dispose()
    }

    ready.set(true)

    return {
      ready,
      microcosms,
      telemetry,
      session,
      ui,
      views,
      dispose
    }
  } catch (error) {
    throw telemetry.catch({
      name: 'createAvpp',
      message: 'Could not create app instance',
      level: 'fail',
      error
    })
  }
}
