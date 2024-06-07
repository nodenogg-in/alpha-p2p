import { vector2 } from '@figureland/mathkit/vector2'
import { system, type Disposable } from '@figureland/statekit'
import type { Pointer, PointerInteractionEvent } from '@figureland/toolkit/pointer'
import { createListener } from '@figureland/toolkit'
import { isString } from '@figureland/typekit/guards'
import { InfinityKit } from './InfinityKit'

const isHTMLElement = (target?: unknown): target is HTMLElement => target instanceof HTMLElement

const getDataAttribute = (element: HTMLElement, propertyName: string): string | null => {
  const dataValue = element.dataset[propertyName]
  return isString(dataValue) ? dataValue : null
}

export const createInteractionHandler = <P extends Pointer>(
  pointer: P,
  kit: InfinityKit
): CanvasInteractionHandler => {
  const { use, dispose } = system()
  use(pointer.key('point').on(() => kit.onPointerMove(pointer.get())))

  return {
    onPointerDown: (e: PointerInteractionEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.focus()
      }
      kit.onPointerDown(pointer.get())
    },
    onPointerUp: (_e: PointerInteractionEvent) => {
      kit.onPointerUp(pointer.get())
    },
    onPointerOver: (_e: PointerInteractionEvent) => {
      kit.onFocus()
    },
    onPointerMove: (_e: PointerInteractionEvent) => {
      _e.preventDefault()
    },
    onPointerOut: (_e: PointerInteractionEvent) => {
      kit.onBlur()
    },
    onFocusIn: (e: FocusEvent) => {
      // e.preventDefault()
      // console.log(e)/
      if (isHTMLElement(e.target)) {
        const selectedEntity = getDataAttribute(e.target, 'entity')
        console.log('select', selectedEntity)
      }
      kit.onFocus()
    },
    onFocusOut: (e: FocusEvent) => {
      if (isHTMLElement(e.target)) {
        const selectedEntity = getDataAttribute(e.target, 'entity')
        console.log('unselect', selectedEntity)
      }
    },
    onBlur: (_e: FocusEvent) => {
      kit.onBlur()
    },
    onWheel: (e: WheelEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.focus()
      }
      kit.wheel(vector2(e.clientX, e.clientY), vector2(e.deltaX, e.deltaY))
    },
    onScroll: (e: Event) => {
      // This intercepts the browser's scroll event and pans the canvas instead.
      // Specifically this is useful when the user uses tab interaction to focus
      // to a focusable/tabbable element that is partially or fully offscreen.
      if (e.target instanceof HTMLElement) {
        kit.canvas.pan(vector2(e.target.scrollLeft, e.target.scrollTop))
        e.target.scrollTop = 0
        e.target.scrollLeft = 0
      }
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
  onFocusIn: (e: FocusEvent) => void
  onFocusOut: (e: FocusEvent) => void
  onScroll: (e: Event) => void
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
  use(createListener(element, 'focusin', handler.onFocusIn))
  use(createListener(element, 'focusout', handler.onFocusOut))
  use(createListener(element, 'blur', handler.onBlur))
  use(createListener(element, 'wheel', handler.onBlur))
  return {
    dispose
  }
}
