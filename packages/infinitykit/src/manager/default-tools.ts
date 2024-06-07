import type { InfinityKit } from '../InfinityKit'
import type { Tool } from '../tools/Tool'

export const selectTool: Tool<InfinityKit> = () => {
  return {
    name: 'select',
    title: 'Select',
    icon: 'select',
    command: 'v',
    onPointerDown: (kit, p) => {
      console.log('down')
    },
    onPointerMove: (kit, p) => {
      console.log('move')
    },
    onPointerUp: (kit, p) => {
      console.log('up')
    },
    onWheel: (kit, p) => {},
    onSelect: (kit) => {},
    onDeselect: (kit) => {}
  }
}

export const moveTool: Tool<InfinityKit> = () => {
  return {
    name: 'move',
    title: 'Move',
    icon: 'move',
    command: 'h',
    onPointerDown: (kit, p) => {},
    onPointerMove: (kit, p) => {},
    onPointerUp: (kit, p) => {},
    onWheel: (kit, p) => {},
    onSelect: (kit) => {},
    onDeselect: (kit) => {}
  }
}

export const drawNode: Tool<InfinityKit> = () => {
  return {
    name: 'drawNode',
    title: 'Add node',
    icon: 'drawNode',
    onPointerDown: (kit, p) => {},
    onPointerMove: (kit, p) => {},
    onPointerUp: (kit, p) => {},
    onWheel: (kit, p) => {},
    onSelect: (kit) => {},
    onDeselect: (kit) => {}
  }
}

export const drawRegion: Tool<InfinityKit> = () => {
  return {
    name: 'drawRegion',
    title: 'Add region',
    icon: 'drawRegion',
    onPointerDown: (kit, p) => {},
    onPointerMove: (kit, p) => {},
    onPointerUp: (kit, p) => {},
    onWheel: (kit, p) => {},
    onSelect: (kit) => {},
    onDeselect: (kit) => {}
  }
}

export const defaultTools = {
  select: selectTool(),
  move: moveTool(),
  drawNode: drawNode(),
  drawRegion: drawRegion()
}

export type DefaultTools = typeof defaultTools
