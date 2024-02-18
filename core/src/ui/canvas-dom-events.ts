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

export const createCanvasEvents = ({
  updateCursorPosition,
  onPointerDown,
  onPointerUp,
  onVisibilityChange,
  validate
}: CreateCanvasEvents) => {
  const visibilityListener = () => {
    onVisibilityChange(document.visibilityState !== 'hidden')
  }

  const prevent = (e: CanvasInteractionEvent) => {
    validate(e, allowEvent(e))
  }
  document.addEventListener('gesturestart', prevent)
  document.addEventListener('gesturechange', prevent)
  document.addEventListener('gestureend', prevent)
  window.addEventListener('wheel', prevent, { passive: false })
  window.addEventListener('touchstart', prevent)
  window.addEventListener('pointermove', updateCursorPosition)
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('visibilitychange', visibilityListener)

  return () => {
    window.removeEventListener('pointermove', updateCursorPosition)
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('visibilitychange', visibilityListener)
    document.removeEventListener('gesturestart', prevent)
    document.removeEventListener('gesturechange', prevent)
    document.removeEventListener('gestureend', prevent)
    window.removeEventListener('wheel', prevent)
    window.removeEventListener('touchstart', prevent)
  }
}
