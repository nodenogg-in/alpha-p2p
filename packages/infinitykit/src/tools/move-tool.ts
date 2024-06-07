import type { InfinityKit } from '../InfinityKit'
import type { Tool } from './Tool'

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
