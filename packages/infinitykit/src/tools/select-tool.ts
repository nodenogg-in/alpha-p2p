import type { InfinityKit } from '../InfinityKit'
import type { Tool } from './Tool'

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
