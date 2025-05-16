import { NN_IMPORT_FORMATS } from '@nodenogg.in/app/io/import'
import { type Device, createDevice } from '@figureland/kit/browser/device'
// import { type Pointer, createPointer } from '@figureland/kit/browser/pointer'
import { type FileDrop, createFileDrop } from '@figureland/kit/browser/filedrop'
import { type KeyCommands, createKeyCommands } from '@figureland/kit/browser/keycommands'
import { type Viewport, createViewport } from '@figureland/kit/browser/viewport'
import { type Fullscreen, createFullscreen } from '@figureland/kit/browser/fullscreen'
import { type Clipboard, createClipboard } from '@figureland/kit/browser/clipboard'

import { state, type State, type Store, store as createStore } from '@figureland/kit/state'
import { APP_NAME, APP_VERSION } from '.'
import { type UI, createUI } from './ui'

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
export const createApp = (): App => {
  const store = createStore()
  try {
    const ready = store.use(state(false))

    // telemetry.log({
    //   name: 'createApp',
    //   message: `＼(^‿^)／ ${APP_NAME} v${APP_VERSION}`,
    //   level: 'status'
    // })

    const ui = store.use(createUI())
    const device = store.use(createDevice())
    const screen = store.use(createViewport(breakpoints))
    const fullscreen = store.use(createFullscreen())
    const filedrop = store.use(createFileDrop({ mimeTypes: [...NN_IMPORT_FORMATS] }))
    const keycommands = store.use(createKeyCommands())
    const clipboard = store.use(createClipboard())
    // const pointer = store.use(
    //   createPointer({
    //     preventGestureDefault: !device.get().safari,
    //     filterEvents: (e) => {
    //       e.preventDefault()
    //       e.stopPropagation()
    //     }
    //   })
    // )

    store.use(
      clipboard.events.on('copy', (items) => {
        console.log('copy')
        console.log(items)
      })
    )

    store.use(
      clipboard.events.on('paste', (items) => {
        console.log('paste')
        console.log(items)
      })
    )

    store.use(
      keycommands.on({
        m: () => ui.key('menuOpen').set((m) => !m),
        backslash: () => ui.key('showUI').set((u) => !u)
      })
    )

    filedrop.events.all((result) => {
      console.log(result)
    })

    ready.set(true)

    // store.use(() =>
    // telemetry.log({
    //   name: 'dispose',
    //   message: 'Disposing app',
    //   level: 'status'
    // })
    // )

    // telemetry.log({
    //   name: 'createApp',
    //   message: `＼(^‿^)／ loaded`,
    //   level: 'status'
    // })

    console.log('hello app')
    return {
      ui,
      ready,
      screen,
      fullscreen,
      device,
      // pointer,
      filedrop,
      keycommands,
      clipboard,
      use: store.use,
      unique: store.unique,
      dispose: store.dispose
    }
  } catch (error) {
    console.log(error)
    throw error
    // throw telemetry.catch({
    //   name: 'createApp',
    //   message: 'Could not create app instance',
    //   level: 'fail',
    //   error
    // })
  }
}

export interface App extends Store {
  ui: UI
  ready: State<boolean>
  screen: Viewport<typeof breakpoints>
  fullscreen: Fullscreen
  device: Device
  // pointer: Pointer
  filedrop: FileDrop
  keycommands: KeyCommands
  clipboard: Clipboard
}
