import type { InfinityKit } from '../InfinityKit'
import type { Tool } from './Tool'

export const entityTool: Tool<InfinityKit> = () => {
  return {
    name: 'entity',
    title: 'Add node',
    icon: 'entity',
    onPointerDown: (kit, p) => {},
    onPointerMove: (kit, p) => {},
    onPointerUp: (kit, p) => {},
    onWheel: (kit, p) => {},
    onSelect: (kit) => {},
    onDeselect: (kit) => {}
  }
}
