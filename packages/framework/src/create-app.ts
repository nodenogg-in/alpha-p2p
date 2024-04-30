import { IMPORT_FORMATS } from '@nodenogg.in/io/import'
import { SCHEMA_VERSION, type MicrocosmAPI, type MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import { type TelemetryOptions, Telemetry } from '@nodenogg.in/microcosm/telemetry'
import { type Device, createDevice } from '@figureland/toolkit/device'
import { type Pointer, createPointer } from '@figureland/toolkit/pointer'
import { type FileDrop, createFileDrop } from '@figureland/toolkit/filedrop'
import { type KeyCommands, createKeyCommands } from '@figureland/toolkit/keycommands'
import { type Screen, createScreen } from '@figureland/toolkit/screen'
import { type Fullscreen, createFullscreen } from '@figureland/toolkit/fullscreen'
import { type Clipboard, createClipboard } from '@figureland/toolkit/clipboard'
import {
  type PersistenceName,
  type Signal,
  type Manager,
  signal,
  manager
} from '@figureland/statekit'
import { createMicrocosmManager } from './microcosm-manager'
import { APP_NAME, APP_VERSION, MicrocosmManager } from '.'
import { type Session, createSession } from './session'
import { type UI, createUI } from './ui'
import { type IdentitySession, createIdentitySession } from './identity'
import { createViewManager, type ViewManager } from './view-manager'

export const getPersistenceName = (name: PersistenceName) => [
  '',
  SCHEMA_VERSION.toString(),
  ...name
]

/* 
  Creates an app instance
*/
export const createApp = <M extends MicrocosmAPI>(options: {
  api: MicrocosmAPIFactory<M>
  telemetry?: TelemetryOptions
}): App<M> => {
  const { use, dispose, unique } = manager()
  const telemetry = use(new Telemetry())
  try {
    if (options.telemetry) {
      telemetry.init(options.telemetry)
    }

    const ready = use(signal(() => false))

    telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ ${APP_NAME} app v${APP_VERSION}, schema v${SCHEMA_VERSION}`,
      level: 'status'
    })

    const identity = use(createIdentitySession())
    const ui = use(createUI())
    const device = use(createDevice())
    const screen = use(createScreen())
    const fullscreen = use(createFullscreen())
    const filedrop = use(createFileDrop({ mimeTypes: [...IMPORT_FORMATS] }))
    const keycommands = use(createKeyCommands())
    const clipboard = use(createClipboard())
    const pointer = use(
      createPointer({
        filterEvents: (e) => {
          e.preventDefault()
          e.stopPropagation()
        }
      })
    )

    clipboard.events.on('copy', (items) => {
      console.log('copy')
      console.log(items)
    })
    clipboard.events.on('paste', (items) => {
      console.log('paste')
      console.log(items)
    })

    use(
      keycommands.onMany({
        m: () => ui.key('menuOpen').set((m) => !m),
        backslash: () => ui.key('showUI').set((u) => !u)
      })
    )

    const session = use(createSession())
    const microcosms = use(
      createMicrocosmManager({
        api: options.api,
        identity,
        session,
        telemetry
      })
    )

    const views = use(createViewManager())

    ready.set(true)

    return {
      ui,
      ready,
      screen,
      microcosms,
      telemetry,
      fullscreen,
      session,
      device,
      pointer,
      filedrop,
      keycommands,
      clipboard,
      views,
      identity,
      use,
      unique,
      dispose: () => {
        telemetry.log({
          name: 'dispose',
          message: 'Disposing app',
          level: 'status'
        })
        dispose()
      }
    }
  } catch (error) {
    throw telemetry.catch({
      name: 'createApp',
      message: 'Could not create app instance',
      level: 'fail',
      error
    })
  }
}

export interface App<M extends MicrocosmAPI> extends Manager {
  ui: UI
  ready: Signal<boolean>
  screen: Screen
  microcosms: MicrocosmManager<M>
  telemetry: Telemetry
  fullscreen: Fullscreen
  session: Session
  device: Device
  pointer: Pointer
  filedrop: FileDrop
  keycommands: KeyCommands
  views: ViewManager
  identity: IdentitySession
  clipboard: Clipboard
}
