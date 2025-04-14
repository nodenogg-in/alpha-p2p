import { NN_IMPORT_FORMATS } from '@nodenogg.in/app/io/import'
import { type TelemetryOptions, Telemetry } from '@nodenogg.in/microcosm/telemetry'
import { type Device, createDevice } from '@figureland/kit/browser/device'
import { type Pointer, createPointer } from '@figureland/kit/browser/pointer'
import { type FileDrop, createFileDrop } from '@figureland/kit/browser/filedrop'
import { type KeyCommands, createKeyCommands } from '@figureland/kit/browser/keycommands'
import { type Viewport, createViewport } from '@figureland/kit/browser/viewport'
import { type Fullscreen, createFullscreen } from '@figureland/kit/browser/fullscreen'
import { type Clipboard, createClipboard } from '@figureland/kit/browser/clipboard'

import { state, type State, type Manager, manager } from '@figureland/kit/state'
import { APP_NAME, APP_VERSION } from '.'
import { type UI, createUI } from './ui'
import { ViewManager } from './ViewManager'

const SCHEMA_VERSION = 0

export const getPersistenceName = (name: string[]) =>
  `${APP_NAME}/${SCHEMA_VERSION.toString()}/${name.join('/')}`

export const breakpoints = {
  small: 320,
  width: 640,
  large: 1080
} as const

/* 
  Creates an app instance
*/
export const createApp = (options: { telemetry?: TelemetryOptions }): App => {
  const { use, dispose, unique } = manager()
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

    const ui = use(createUI())
    const device = use(createDevice())
    const screen = use(createViewport(breakpoints))
    const fullscreen = use(createFullscreen())
    const filedrop = use(createFileDrop({ mimeTypes: [...NN_IMPORT_FORMATS] }))
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

    const views = use(new ViewManager())

    ready.set(true)

    console.log('ready!')
    use(() =>
      telemetry.log({
        name: 'dispose',
        message: 'Disposing app',
        level: 'status'
      })
    )

    telemetry.log({
      name: 'createApp',
      message: `＼(^‿^)／ loaded`,
      level: 'status'
    })

    return {
      ui,
      ready,
      screen,
      telemetry,
      fullscreen,
      device,
      pointer,
      filedrop,
      keycommands,
      clipboard,
      views,
      use,
      unique,
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

export interface App extends Manager {
  ui: UI
  ready: State<boolean>
  screen: Viewport<typeof breakpoints>
  telemetry: Telemetry
  fullscreen: Fullscreen
  device: Device
  pointer: Pointer
  filedrop: FileDrop
  keycommands: KeyCommands
  views: ViewManager
  clipboard: Clipboard
}
