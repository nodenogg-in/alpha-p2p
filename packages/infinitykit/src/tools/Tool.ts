import type { PointerState } from '@figureland/toolkit'
import { InfinityKit } from '../InfinityKit'

export type Tool<C extends InfinityKit = InfinityKit> = () => {
  name: string
  title: string
  command?: string
  icon?: string
  hidden?: boolean
  onSelect?(c: C): void
  onDeselect?(c: C): void
  onPointerDown?(c: C, p: PointerState): void
  onPointerMove?(c: C, p: PointerState): void
  onPointerUp?(c: C, p: PointerState): void
  onWheel?(c: C, p: PointerState): void
}

export type Toolset<C extends InfinityKit = InfinityKit> = Record<string, Tool<C>>
