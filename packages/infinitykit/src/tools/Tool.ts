import type { PointerState } from '@figureland/toolkit'

export type Tool<C> = () => {
  name: string
  onSelect?(c: C): void
  onDeselect?(c: C): void
  onPointerDown?(c: C, p: PointerState): void
  onPointerMove?(c: C, p: PointerState): void
  onPointerUp?(c: C, p: PointerState): void
  onWheel?(c: C, p: PointerState): void
}

export type Toolset<C> = Record<string, Tool<C>>
