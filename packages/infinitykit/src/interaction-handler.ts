import { vector2 } from '@figureland/mathkit/vector2'
import { system, type Disposable } from '@figureland/statekit'
import type { Pointer, PointerInteractionEvent } from '@figureland/toolkit/pointer'
import { createListener } from '@figureland/toolkit'
import type { Actions } from './Actions'

export const createInteractionHandler = <P extends Pointer>(
  pointer: P,
  actions: Actions
): CanvasInteractionHandler => {
  const { use, dispose } = system()
  use(pointer.key('point').on(() => actions.update(pointer.get())))

  return {
    onPointerDown: (e: PointerInteractionEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.focus()
      }
      actions.start(pointer.get())
    },
    onPointerUp: (_e: PointerInteractionEvent) => {
      actions.finish(pointer.get())
    },
    onPointerOver: (_e: PointerInteractionEvent) => {
      actions.focus()
    },
    onPointerMove: (_e: PointerInteractionEvent) => {
      _e.preventDefault()
    },
    onPointerOut: (_e: PointerInteractionEvent) => {
      actions.blur()
    },
    onFocus: (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target && target.getAttribute('tabindex') === '0') {
        e.preventDefault()
        target.focus?.({ preventScroll: true })
      }
      actions.focus()
    },
    onBlur: (_e: FocusEvent) => {
      actions.blur()
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

export type CanvasInteractionHandler = Disposable & {
  onPointerDown: (e: PointerInteractionEvent) => void
  onPointerUp: (e: PointerInteractionEvent) => void
  onPointerOver: (e: PointerInteractionEvent) => void
  onPointerMove: (e: PointerInteractionEvent) => void
  onPointerOut: (e: PointerInteractionEvent) => void
  onFocus: (e: FocusEvent) => void
  onBlur: (e: FocusEvent) => void
  onWheel: (e: WheelEvent) => void
}

export const attachHandler = (element: HTMLElement, handler: CanvasInteractionHandler) => {
  const { dispose, use } = system()
  use(createListener(element, 'pointerdown', handler.onPointerDown))
  use(createListener(element, 'pointerup', handler.onPointerUp))
  use(createListener(element, 'pointerover', handler.onPointerOver))
  use(createListener(element, 'pointermove', handler.onPointerMove))
  use(createListener(element, 'pointerout', handler.onPointerOut))
  use(createListener(element, 'focus', handler.onFocus))
  use(createListener(element, 'blur', handler.onBlur))
  use(createListener(element, 'wheel', handler.onBlur))
  return {
    dispose
  }
}
