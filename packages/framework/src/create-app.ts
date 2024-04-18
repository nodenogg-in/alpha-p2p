import { Device, createDevice } from '@figureland/infinitykit/device'
import { Pointer, createPointer } from '@figureland/infinitykit/pointer'
import { FileDrop, createFileDrop } from '@figureland/infinitykit/filedrop'
import { KeyCommands, createKeyCommands } from '@figureland/infinitykit/keycommands'
import { Screen, createScreen } from '@figureland/infinitykit/screen'
import { type PersistenceName, signal, type Signal } from '@figureland/statekit'
import { IMPORT_FORMATS } from '@nodenogg.in/io/import'
import { SCHEMA_VERSION, type MicrocosmAPI, type MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import { createMicrocosmManager } from './microcosm-manager'
import { Telemetry, type TelemetryOptions } from './Telemetry'
import { APP_NAME, APP_VERSION, MicrocosmManager } from '.'
import { Session, createSession } from './session'
import { createUI } from './ui'
import { IdentitySession, createIdentitySession } from './identity'
import { createViewManager, type ViewManager } from './view-manager'

export const getPersistenceName = (name: PersistenceName) => [
  '',
  SCHEMA_VERSION.toString(),
  ...name
]

/* 
  Creates an app instance
*/
export const createApp = <M extends MicrocosmAPI>({
  telemetry: telemetryOptions,
  api
}: {
  api: MicrocosmAPIFactory<M>
  telemetry?: TelemetryOptions
}): App<M> => {
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

    const filedrop = createFileDrop({ mimeTypes: [...IMPORT_FORMATS] })

    // const ui = new UI(getPersistenceName(['ui', 'state']))

    const session = createSession()
    const microcosms = createMicrocosmManager<M, Telemetry>({
      api,
      identity,
      session,
      telemetry
    })

    console.log('hello! ', 'something 1112sdss33')

    const views = createViewManager()

    const dispose = async () => {
      telemetry.log({
        name: 'dispose',
        message: 'Disposing app',
        level: 'status'
      })
      await microcosms.dispose()
      await telemetry.dispose()
      await views.dispose()

      session.dispose()
      ui.dispose()
      screen.dispose()
      identity.dispose()
      device.dispose()
      pointer.dispose()
      filedrop.dispose()
      keycommands.dispose()
      console.log('done disposing')
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

export interface App<M extends MicrocosmAPI> {
  ui: ReturnType<typeof createUI>
  ready: Signal<boolean>
  screen: Screen
  microcosms: MicrocosmManager<M>
  telemetry: Telemetry
  session: Session
  device: Device
  pointer: Pointer
  filedrop: FileDrop
  keycommands: KeyCommands
  views: ViewManager
  identity: IdentitySession
  dispose: () => Promise<void>
}
