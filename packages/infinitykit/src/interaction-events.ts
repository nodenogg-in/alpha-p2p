import { vector2 } from '@figureland/mathkit/vector2'
import { manager } from '@figureland/statekit'
import type { Pointer, PointerInteractionEvent } from '@figureland/toolkit/pointer'
import type { Actions } from './Actions'
import type { ToolSet } from './tools'

export const createInteractionHandler = <T extends ToolSet>(
  actions: Actions<T>,
  pointer: Pointer
) => {
  const { use, dispose } = manager()
  use(pointer.key('point').on(() => actions.move(pointer.get())))

  return {
    onPointerDown: (e: PointerInteractionEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.focus()
      }
      actions.down(pointer.get())
    },
    onPointerMove: () => {
      console.log('pointer move')
    },
    onPointerUp: () => {
      actions.up(pointer.get())
    },
    onPointerOver: () => {
      actions.over()
    },
    onPointerOut: () => {
      actions.out()
    },
    onFocus: (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target && target.getAttribute('tabindex') === '0') {
        e.preventDefault()
        target.focus({ preventScroll: true })
      }
      actions.focus()
    },
    onWheel: (e: WheelEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.focus()
      }

      actions.wheel(vector2(e.clientX, e.clientY), vector2(e.deltaX, e.deltaY))
    },
    dispose
  }
}
