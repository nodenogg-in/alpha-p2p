import { record, type SignalRecord } from '@figureland/statekit'

export const createUI = () =>
  record({
    menuOpen: true,
    showUI: true
  })

export type UI = SignalRecord<{ menuOpen: boolean; showUI: boolean }>
