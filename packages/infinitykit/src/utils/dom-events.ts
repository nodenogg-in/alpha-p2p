import type { Unsubscribe } from '@figureland/statekit'

export type ListenerTarget = Document | Window | HTMLElement | ScreenOrientation

export type PointerInteractionEvent = Event | WheelEvent | PointerEvent | MouseEvent | TouchEvent

export type AppTouchEvent = TouchEvent

export type UnifiedEventMap = WindowEventMap &
  DocumentEventMap &
  HTMLElementEventMap & {
    gesturestart: Event
    gesturechange: Event
    gestureend: Event
  }

export const createListener = <T extends keyof UnifiedEventMap>(
  target: ListenerTarget,
  eventName: T,
  fn: (e: UnifiedEventMap[T]) => void
): Unsubscribe => {
  if (!('on' + eventName in target)) {
    return () => {}
  }
  target.addEventListener(eventName, fn as EventListener)
  return () => target.removeEventListener(eventName, fn as EventListener)
}

export const isPointerEvent = (event: Event): event is PointerEvent => event instanceof PointerEvent

export const UI_CLASS = 'ui'

export const allowEvent = (e: Event) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return true
  }
  if (e.target instanceof HTMLElement && e.target.classList?.contains(UI_CLASS)) {
    return true
  }
  return false
}

export const preventEvents = (e: PointerInteractionEvent) => {
  if (!allowEvent(e)) {
    e.preventDefault()
    e.stopPropagation()
  }
}
