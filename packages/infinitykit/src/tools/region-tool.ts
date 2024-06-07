import type { InfinityKit } from '../InfinityKit'
import type { Tool } from './Tool'

export const regionTool: Tool<InfinityKit> = () => {
  return {
    name: 'region',
    title: 'Add region',
    icon: 'region',
    onPointerDown: (kit, p) => {},
    onPointerMove: (kit, p) => {},
    onPointerUp: (kit, p) => {},
    onWheel: (kit, p) => {},
    onSelect: (kit) => {},
    onDeselect: (kit) => {}
  }
}
