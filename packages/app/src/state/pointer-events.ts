export type PointerInteractionEvent = Event | WheelEvent | PointerEvent | MouseEvent | TouchEvent

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
