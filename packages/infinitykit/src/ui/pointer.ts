import { signalObject } from '@figureland/statekit'
import {
  allowEvent,
  createListener,
  isPointerEvent,
  type ListenerTarget,
  type PointerInteractionEvent
} from '../utils/dom-events'
import { defaultPointerState, type PointerType } from '../schema/pointer.schema'
import vector2 from '@figureland/mathkit/vector2'

type EventFilter = (event: PointerInteractionEvent, valid: boolean) => void

export type PointerOptions = {
  target?: ListenerTarget
  filterEvents?: EventFilter
}

export const createPointer = ({
  target = window,
  filterEvents = () => {}
}: PointerOptions = {}) => {
  const s = signalObject(defaultPointerState())
  const prevent = (e: PointerInteractionEvent) => filterEvents(e, allowEvent(e))

  const onPointerDown = (e: PointerInteractionEvent) => {
    if (!isPointerEvent(e)) {
      return
    }

    const { button, pointerType, shiftKey, metaKey } = e
    prevent(e)

    s.set({
      button,
      metaKey,
      shiftKey,
      pointerType: pointerType as PointerType,
      delta: vector2(),
      origin: s.get().point,
      active: true
    })
  }

  const onPointerMove = (e: PointerInteractionEvent) => {
    if (!isPointerEvent(e)) {
      return
    }
    const { clientX, clientY, shiftKey, metaKey, ctrlKey, button } = e
    prevent(e)

    const point = vector2(clientX, clientY)

    const current = s.get()

    const delta = current.active
      ? vector2(point.x - current.point.x, point.y - current.point.y)
      : vector2()

    const hasDelta = delta.x !== 0 || delta.y !== 0

    s.set({
      button,
      metaKey,
      shiftKey,
      ctrlKey,
      point,
      delta,
      hasDelta
    })
  }

  const onPointerUp = (e: PointerInteractionEvent) => {
    prevent(e)
    s.set({
      button: null,
      delta: vector2(),
      pointerType: null,
      pinching: false,
      active: false,
      shiftKey: false,
      metaKey: false,
      ctrlKey: false,
      hasDelta: false
    })
  }
  s.use(
    createListener(document, 'gesturestart', prevent),
    createListener(document, 'gesturechange', prevent),
    createListener(document, 'gestureend', prevent),
    createListener(target, 'wheel', prevent),
    createListener(target, 'touchstart', prevent),
    createListener(target, 'pointermove', onPointerMove),
    createListener(target, 'pointerdown', onPointerDown),
    createListener(target, 'pointerup', onPointerUp),
    createListener(target, 'lostpointercapture', onPointerUp)
  )

  return s
}
