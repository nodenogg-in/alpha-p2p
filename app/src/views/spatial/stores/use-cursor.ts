import { onBeforeUnmount, reactive, ref } from 'vue'
import { defaultBox, defaultPoint, type Box, type Point } from '../types'
import { defineStore } from 'pinia'
import { getSelectionBox, getTouchDistance } from '../utils/interaction'

export const useCursor = defineStore('spatial-cursor', () => {
  const touchDistance = ref<number>(0)
  const tracking = ref<boolean>(false)
  const selectionBox = ref<Box>(defaultBox())
  const origin = reactive<Point>(defaultPoint())
  const touchPoint = reactive<Point>(defaultPoint())
  const delta = reactive<Point>(defaultPoint())
  const pinching = ref<boolean>(false)

  const updateCursorPosition = (e: MouseEvent) => {
    touchPoint.x = e.clientX
    touchPoint.y = e.clientY
    if (tracking.value) {
      delta.x = touchPoint.x - origin.x
      delta.y = touchPoint.y - origin.y
      selectionBox.value = getSelectionBox(origin, delta)
    } else {
      delta.x = 0
      delta.y = 0
    }
  }

  const startAction = () => {
    delta.x = 0
    delta.y = 0
    origin.x = touchPoint.x
    origin.y = touchPoint.y
    tracking.value = true
  }

  const finishAction = () => {
    delta.x = 0
    delta.y = 0
    selectionBox.value = defaultBox()
    tracking.value = false
  }

  const updateTouchPosition = (e: TouchEvent) => {
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
    updateTouchPosition(e)

    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchmove', updateTouchPosition)
  }

  const onTouchEnd = () => {
    tracking.value = false
    touchDistance.value = 0
    window.removeEventListener('touchmove', updateTouchPosition)
  }

  document.addEventListener('mousemove', updateCursorPosition)
  window.addEventListener('touchstart', onTouchStart, true)

  const dispose = () => {
    window.removeEventListener('mousemove', updateCursorPosition)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', updateTouchPosition)
    window.removeEventListener('touchend', onTouchEnd)
  }

  onBeforeUnmount(dispose)

  return {
    pinching,
    selectionBox,
    startAction,
    finishAction,
    origin,
    delta,
    touchDistance,
    tracking,
    // resizing,
    touchPoint,
    dispose
  }
})
