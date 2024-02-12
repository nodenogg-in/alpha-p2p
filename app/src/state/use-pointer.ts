import { defaultPoint, type Point } from 'nodenoggin-core/schema'
import { defineStore } from 'pinia'
import { reactive, readonly, ref } from 'vue'

const POINTER_STORE_NAME = 'pointer' as const

type PointerType = 'mouse' | 'pen' | 'touch'

export const usePointer = defineStore(POINTER_STORE_NAME, () => {
  const touchDistance = ref<number>(0)
  const tracking = ref<boolean>(false)
  const origin = reactive<Point>(defaultPoint())
  const touchPoint = reactive<Point>(defaultPoint())
  const delta = reactive<Point>(defaultPoint())
  const pinching = ref<boolean>(false)
  const visible = ref<boolean>(true)
  const pointerType = ref<PointerType>()
  const active = ref<boolean>(false)

  const listener = () => {
    const isVisible = document.visibilityState !== 'hidden'
    visible.value = isVisible
  }

  const updateCursorPosition = (event: PointerEvent) => {
    const { clientX: x, clientY: y } = event
    touchPoint.x = x
    touchPoint.y = y
    if (active.value) {
      delta.x = touchPoint.x - origin.x
      delta.y = touchPoint.y - origin.y
    } else {
      delta.x = 0
      delta.y = 0
    }
  }

  const onPointerDown = (e: PointerEvent) => {
    if (e.button === 2) {
      return
    }

    pointerType.value = e.pointerType as PointerType
    delta.x = 0
    delta.y = 0
    origin.x = touchPoint.x
    origin.y = touchPoint.y

    active.value = true
  }

  const onPointerUp = () => {
    delta.x = 0
    delta.y = 0
    pinching.value = false
    active.value = false
  }

  const preventEvents = (e: WheelEvent | TouchEvent | Event) => {
    e.preventDefault()
    e.stopPropagation()
  }

  document.addEventListener('gesturestart', preventEvents)
  document.addEventListener('gesturechange', preventEvents)
  document.addEventListener('gestureend', preventEvents)
  window.addEventListener('wheel', preventEvents, { passive: false })
  window.addEventListener('touchstart', preventEvents)
  window.addEventListener('pointermove', updateCursorPosition)
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('visibilitychange', listener)

  const dispose = () => {
    window.removeEventListener('pointermove', updateCursorPosition)
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('visibilitychange', listener)
    document.removeEventListener('gesturestart', preventEvents)
    document.removeEventListener('gesturechange', preventEvents)
    document.removeEventListener('gestureend', preventEvents)
    window.removeEventListener('wheel', preventEvents)
    window.removeEventListener('touchstart', preventEvents)
  }

  return {
    dispose,
    visible,
    pointerType,
    active,
    pinching: readonly(pinching),
    tracking: readonly(tracking),
    origin: readonly(origin),
    delta: readonly(delta),
    touchDistance: readonly(touchDistance),
    touchPoint: readonly(touchPoint)
  }
})

// const updateTouchPosition = (e: TouchEvent) => {
//   e.preventDefault()
//   if (e.touches.length === 2) {
//     const distance = getTouchDistance(e.touches[0], e.touches[1])
//     touchDistance.value = distance
//     touchPoint.x = e.touches[0].clientX
//     touchPoint.y = e.touches[0].clientY
//   } else if (e.touches.length === 1) {
//     touchPoint.x = e.touches[0].clientX
//     touchPoint.y = e.touches[0].clientY
//     tracking.value = true
//   }
// }
