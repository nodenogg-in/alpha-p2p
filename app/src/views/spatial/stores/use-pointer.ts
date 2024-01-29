import { defineStore } from 'pinia'
import { onBeforeUnmount, reactive, readonly, ref, watch } from 'vue'
import { defaultPoint, type Point } from '../SpatialView.types'
import { getTouchDistance } from '../utils/geometry'
import { usePointer as usePointerHook } from '@vueuse/core'
const POINTER_STORE_NAME = 'spatial-cursor' as const

export const usePointer = defineStore(POINTER_STORE_NAME, () => {
  const touchDistance = ref<number>(0)
  const tracking = ref<boolean>(false)
  const origin = reactive<Point>(defaultPoint())
  const touchPoint = reactive<Point>(defaultPoint())
  const delta = reactive<Point>(defaultPoint())
  const pinching = ref<boolean>(false)

  const pointer = usePointerHook()

  watch([pointer.x, pointer.y], ([x, y]) => {
    updateCursorPosition({ x, y })
  })

  const updateCursorPosition = (p: Point) => {
    touchPoint.x = p.x
    touchPoint.y = p.y
    if (tracking.value) {
      delta.x = touchPoint.x - origin.x
      delta.y = touchPoint.y - origin.y
    } else {
      delta.x = 0
      delta.y = 0
    }
  }

  const startAction = ({ pinch = false }: { pinch?: boolean } = {}) => {
    delta.x = 0
    delta.y = 0
    origin.x = touchPoint.x
    origin.y = touchPoint.y
    pinching.value = pinch
    tracking.value = true
  }

  const finishAction = () => {
    delta.x = 0
    delta.y = 0
    pinching.value = false
    tracking.value = false
  }

  const updateTouchPosition = (e: TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      touchDistance.value = distance
      touchPoint.x = e.touches[0].clientX
      touchPoint.y = e.touches[0].clientY
    } else if (e.touches.length === 1) {
      touchPoint.x = e.touches[0].clientX
      touchPoint.y = e.touches[0].clientY
      tracking.value = true
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    e.preventDefault()
    updateTouchPosition(e)

    // window.addEventListener('touchend', onTouchEnd)
    // window.addEventListener('touchmove', updateTouchPosition)
  }

  const onTouchEnd = () => {
    tracking.value = false
    touchDistance.value = 0
    // window.removeEventListener('touchmove', updateTouchPosition)
  }

  // window.addEventListener('pointermove', updateCursorPosition)

  // const dispose = () => {
  //   window.removeEventListener('pointermove', updateCursorPosition)
  //   window.removeEventListener('touchstart', onTouchStart)
  //   window.removeEventListener('touchmove', updateTouchPosition)
  //   window.removeEventListener('touchend', onTouchEnd)
  // }

  // onBeforeUnmount(dispose)

  return {
    startAction,
    finishAction,
    // dispose,
    pinching: readonly(pinching),
    tracking: readonly(tracking),
    origin: readonly(origin),
    delta: readonly(delta),
    touchDistance: readonly(touchDistance),
    touchPoint: readonly(touchPoint)
  }
})
