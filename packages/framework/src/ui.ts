import { signalObject, type SignalObject } from '@figureland/statekit'

export const createUI = () =>
  signalObject({
    menuOpen: true,
    showUI: true
  })

export type UI = SignalObject<{ menuOpen: boolean; showUI: boolean }>
