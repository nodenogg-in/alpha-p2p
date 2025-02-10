import { shape, type Shape } from '@figureland/kit/state'

export const createUI = () =>
  shape({
    menuOpen: true,
    showUI: true
  })

export type UI = Shape<{ menuOpen: boolean; showUI: boolean }>
