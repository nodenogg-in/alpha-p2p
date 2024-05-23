import { IMPORT_FORMATS } from '@nodenogg.in/io/import'
import { type MicrocosmAPI, type MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
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
  type System,
  signal,
  system
} from '@figureland/statekit'
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
  const { use, dispose, unique } = system()
  const telemetry = use(new Telemetry())
  try {
    if (options.telemetry) {
      telemetry.init(options.telemetry)
    }

    const ready = use(signal(() => false))

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
      keycommands.onMany({
        m: () => ui.key('menuOpen').set((m) => !m),
        backslash: () => ui.key('showUI').set((u) => !u)
      })
    )

    const microcosms = use(
      new MicrocosmManager({
        api: options.api,
        telemetry
      })
    )
    const views = use(new ViewManager())

    ready.set(true)

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

export interface App<M extends MicrocosmAPI> extends System {
  ui: UI
  ready: Signal<boolean>
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
