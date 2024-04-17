import { createDevice } from '@figureland/infinitykit/device'
import { createPointer } from '@figureland/infinitykit/pointer'
import { createFileDrop } from '@figureland/infinitykit/filedrop'
import { createKeyCommands } from '@figureland/infinitykit/keycommands'
import { createScreen } from '@figureland/infinitykit/screen'
import { type PersistenceName, signal } from '@figureland/statekit'
import { VALID_IMPORT_FORMATS } from '@nodenogg.in/io/import'
import { SCHEMA_VERSION, type MicrocosmAPI, type MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import { Microcosms } from './state/Microcosms'
import { Telemetry, type TelemetryOptions } from './state/Telemetry'
import { MicrocosmViews, ViewManager } from './state/ViewManager'
import { APP_NAME, APP_VERSION } from '.'
import { Session } from './state/Session'
import { createUI } from './state/ui'
import { createIdentitySession } from './state/identity'

export const getPersistenceName = (name: PersistenceName) => [
  '',
  SCHEMA_VERSION.toString(),
  ...name
]

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

    const identity = createIdentitySession()
    const ui = createUI()
    const device = createDevice()
    const screen = createScreen()
    const pointer = createPointer({
      target: window,
      filterEvents: (e) => {
        e.preventDefault()
        e.stopPropagation()
      }
    })

    const keycommands = createKeyCommands()

    ui.use(
      keycommands.onMany({
        m: () => ui.key('menuOpen').set((m) => !m),
        backslash: () => ui.key('showUI').set((u) => !u)
      })
    )

    const filedrop = createFileDrop({ mimeTypes: [...VALID_IMPORT_FORMATS] })

    // const ui = new UI(getPersistenceName(['ui', 'state']))

    const session = new Session(getPersistenceName(['app', 'microcosms']))

    const microcosms = new Microcosms<M, Telemetry>(api, identity, session, telemetry)
    const views = new ViewManager<M, V>(viewFactories, defaultView, true)

    const dispose = async () => {
      telemetry.log({
        name: 'dispose',
        message: 'Disposing app',
        level: 'status'
      })
      await microcosms.dispose()
      await session.dispose()
      await telemetry.dispose()
      ui.dispose()
      screen.dispose()
      identity.dispose()
      device.dispose()
      pointer.dispose()
      filedrop.dispose()
      keycommands.dispose()
    }

    ready.set(true)

    return {
      ui,
      ready,
      screen,
      microcosms,
      telemetry,
      session,
      device,
      pointer,
      filedrop,
      keycommands,
      views,
      identity,
      dispose
    }
  } catch (error) {
    console.log(error)
    throw telemetry.catch({
      name: 'createApp',
      message: 'Could not create app instance',
      level: 'fail',
      error
    })
  }
}
