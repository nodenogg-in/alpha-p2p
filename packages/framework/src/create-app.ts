import { IMPORT_FORMATS } from '@nodenogg.in/io/import'
import { type MicrocosmAPI, type MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import { type TelemetryOptions, Telemetry } from '@nodenogg.in/microcosm/telemetry'
import { type Device, createDevice } from '@figureland/kit/dom/device'
import { type Pointer, createPointer } from '@figureland/kit/dom/pointer'
import { type FileDrop, createFileDrop } from '@figureland/kit/dom/filedrop'
import { type KeyCommands, createKeyCommands } from '@figureland/kit/dom/keycommands'
import { type Screen, createScreen } from '@figureland/kit/dom/screen'
import { type Fullscreen, createFullscreen } from '@figureland/kit/dom/fullscreen'
import { type Clipboard, createClipboard } from '@figureland/kit/dom/clipboard'

import { type PersistenceName, type State, type System, system } from '@figureland/kit/state'
import { APP_NAME, APP_VERSION } from '.'
import { type UI, createUI } from './ui'
import { type IdentitySession, createIdentitySession } from './identity'
import { ViewManager } from './ViewManager'
import { MicrocosmManager } from './MicrocosmManager'

const SCHEMA_VERSION = 0

export const getPersistenceName = (name: PersistenceName) => [
  '',
  SCHEMA_VERSION.toString(),
  ...name
]

export const breakpoints = {
  small: 320,
  width: 640,
  large: 1080
} as const

/* 
  Creates an app instance
*/
export const createApp = <M extends MicrocosmAPI>(options: {
  api: MicrocosmAPIFactory<M>
  telemetry?: TelemetryOptions
}): App<M> => {
  const { use, dispose, unique, state } = system()
  const telemetry = use(new Telemetry())
  try {
    if (options.telemetry) {
      telemetry.init(options.telemetry)
    }

    const ready = use(state(false))

    telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ ${APP_NAME} v${APP_VERSION}`,
      level: 'status'
    })

    const identity = use(createIdentitySession())
    const ui = use(createUI())
    const device = use(createDevice())
    const screen = use(createScreen(breakpoints))
    const fullscreen = use(createFullscreen())
    const filedrop = use(createFileDrop({ mimeTypes: [...IMPORT_FORMATS] }))
    const keycommands = use(createKeyCommands())
    const clipboard = use(createClipboard())
    const pointer = use(
      createPointer({
        preventGestureDefault: !device.get().safari,
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
      keycommands.on({
        m: () => ui.key('menuOpen').set((m) => !m),
        backslash: () => ui.key('showUI').set((u) => !u)
      })
    )

    filedrop.events.all((result) => {
      console.log(result)
    })

    const microcosms = use(
      new MicrocosmManager({
        api: options.api,
        telemetry
      })
    )
    const views = use(new ViewManager())

    ready.set(true)

    use(() =>
      telemetry.log({
        name: 'dispose',
        message: 'Disposing app',
        level: 'status'
      })
    )

    return {
      ui,
      ready,
      screen,
      microcosms,
      telemetry,
      fullscreen,
      device,
      pointer,
      filedrop,
      keycommands,
      clipboard,
      views,
      identity,
      use,
      unique,
      dispose,
      state
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

export interface App<M extends MicrocosmAPI> extends System {
  ui: UI
  ready: State<boolean>
  screen: Screen<typeof breakpoints>
  microcosms: MicrocosmManager<M>
  telemetry: Telemetry
  fullscreen: Fullscreen
  device: Device
  pointer: Pointer
  filedrop: FileDrop
  keycommands: KeyCommands
  views: ViewManager
  identity: IdentitySession
  clipboard: Clipboard
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type InferAppMicrocosmAPI<API> = API extends App<infer API> ? API : never
