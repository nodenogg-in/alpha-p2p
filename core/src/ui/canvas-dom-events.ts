export const UI_CLASS = 'ui'

const allowEvent = (e: CanvasInteractionEvent) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return true
  }
  if (e.target instanceof HTMLElement && e.target.classList?.contains(UI_CLASS)) {
    return true
  }
  return false
}

export type CanvasInteractionEvent = WheelEvent | PointerEvent | MouseEvent | TouchEvent

export const preventEvents = (e: CanvasInteractionEvent) => {
  if (!allowEvent(e)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

type CreateCanvasEvents = {
  updateCursorPosition: (event: PointerEvent) => void
  onPointerDown: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
  onVisibilityChange: (visible: boolean) => void
  validate: (event: CanvasInteractionEvent, valid: boolean) => void
}

export const createCanvasEvents = (
  {
    updateCursorPosition,
    onPointerDown,
    onPointerUp,
    onVisibilityChange,
    validate
  }: CreateCanvasEvents,
  target: Window | HTMLElement = window
) => {
  const visibilityListener = () => {
    onVisibilityChange(document.visibilityState !== 'hidden')
  }

  const prevent = (e: CanvasInteractionEvent) => {
    validate(e, allowEvent(e))
  }
  document.addEventListener('gesturestart', prevent)
  document.addEventListener('gesturechange', prevent)
  document.addEventListener('gestureend', prevent)
  target.addEventListener('wheel', prevent, { passive: false })
  target.addEventListener('touchstart', prevent)
  target.addEventListener('pointermove', updateCursorPosition)
  target.addEventListener('pointerdown', onPointerDown)
  target.addEventListener('pointerup', onPointerUp)
  target.addEventListener('visibilitychange', visibilityListener)

  return () => {
    document.removeEventListener('gesturestart', prevent)
    document.removeEventListener('gesturechange', prevent)
    document.removeEventListener('gestureend', prevent)
    target.removeEventListener('wheel', prevent)
    target.removeEventListener('touchstart', prevent)
    target.removeEventListener('pointermove', updateCursorPosition)
    target.removeEventListener('pointerdown', onPointerDown)
    target.removeEventListener('pointerup', onPointerUp)
    target.removeEventListener('visibilitychange', visibilityListener)
  }
}
