import type { PointerState } from '@figureland/toolkit'
import { CanvasManager } from './BaseCanvasManager'
import { Tool } from '../tools/Tool'

export const selectTool: Tool<CanvasManager> = () => {
  return {
    name: 'select',
    onPointerDown: (e, p) => {},
    onPointerMove: (e, p) => {},
    onPointerUp: (e, p) => {},
    onWheel: (e, p) => {},
    onSelect: (e) => {},
    onDeselect: (e) => {}
  }
}

export const defaultTools = {
  select: selectTool()
}

export type DefaultTools = typeof defaultTools
