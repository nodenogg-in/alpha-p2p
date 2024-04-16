import { signalObject } from '@figureland/statekit'

export const createUI = () =>
  signalObject({
    menuOpen: true,
    showUI: true
  })
