import { createDevice } from '@figureland/kit/browser/device'
import { createFileDrop } from '@figureland/kit/browser/filedrop'
import { createKeyCommands } from '@figureland/kit/browser/keycommands'
import { createViewport } from '@figureland/kit/browser/viewport'
import { createFullscreen } from '@figureland/kit/browser/fullscreen'
import { createClipboard } from '@figureland/kit/browser/clipboard'

import { state, store, struct } from '@figureland/kit/state'
import { APP_NAME } from './constants'

export const NN_IMPORT_FORMATS = [
  'text/markdown',
  'text/plain',
  'text/html',
  'image/svg+xml',
  'application/json'
] as const

const SCHEMA_VERSION = 0

export const getPersistenceName = (name: string[]) =>
  `${APP_NAME}/${SCHEMA_VERSION.toString()}/${name.join('/')}`

export const breakpoints = {
  small: 320,
  width: 640,
  large: 1080
} as const

/**
 * App class
 * Main application class for the Nodenogg.in app
 */
export class App {
  private appStore = store()

  readonly use = this.appStore.use
  readonly unique = this.appStore.unique
  readonly dispose = this.appStore.dispose

  readonly ui = this.use(
    struct({
      menuOpen: true,
      showUI: true
    })
  )
  readonly ready = this.use(state(false))
  readonly device = this.use(createDevice())
  readonly screen = this.use(createViewport(breakpoints))
  readonly fullscreen = this.use(createFullscreen())
  readonly filedrop = this.use(createFileDrop({ mimeTypes: [...NN_IMPORT_FORMATS] }))
  readonly keycommands = this.use(createKeyCommands())
  readonly clipboard = this.use(createClipboard())

  constructor() {
    try {
      // Set up clipboard event listeners
      this.use(
        this.clipboard.events.on('copy', (items) => {
          console.log('copy')
          console.log(items)
        })
      )

      this.use(
        this.clipboard.events.on('paste', (items) => {
          console.log('paste')
          console.log(items)
        })
      )

      // Set up keyboard shortcuts
      this.use(
        this.keycommands.on({
          m: () => this.ui.key('menuOpen').set((m) => !m),
          backslash: () => this.ui.key('showUI').set((u) => !u)
        })
      )

      // Set up file drop handlers
      this.filedrop.events.all((result) => {
        console.log(result)
      })

      // App is ready
      this.ready.set(true)

      // Register a dispose callback if needed
      // this.use(() => {
      //   console.log('Disposing app')
      // })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
