import { struct, type Struct } from '@figureland/kit/state'

export const createUI = () =>
  struct({
    menuOpen: true,
    showUI: true
  })

export type UI = Struct<{ menuOpen: boolean; showUI: boolean }>
