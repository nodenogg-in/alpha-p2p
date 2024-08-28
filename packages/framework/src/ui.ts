import { record, type StateRecord } from '@figureland/kit/state'

export const createUI = () =>
  record({
    menuOpen: true,
    showUI: true
  })

export type UI = StateRecord<{ menuOpen: boolean; showUI: boolean }>
