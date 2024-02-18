import { createCanvasEvents } from 'nodenoggin-core'
import { defaultPoint, type Point } from 'nodenoggin-core/views/canvas'
import { defineStore } from 'pinia'
import { reactive, readonly, ref } from 'vue'

const POINTER_STORE_NAME = 'pointer' as const

type PointerType = 'mouse' | 'pen' | 'touch'

export const usePointer = defineStore(POINTER_STORE_NAME, () => {
  const touchDistance = ref<number>(0)
  const tracking = ref<boolean>(false)
  const origin = reactive<Point>(defaultPoint())
  const point = reactive<Point>(defaultPoint())
  const delta = reactive<Point>(defaultPoint())
  const pinching = ref<boolean>(false)
  const visible = ref<boolean>(true)
  const pointerType = ref<PointerType>()
  const active = ref<boolean>(false)

  const updateCursorPosition = (event: PointerEvent) => {
    const { clientX: x, clientY: y } = event
    point.x = x
    point.y = y
    if (active.value) {
      delta.x = point.x - origin.x
      delta.y = point.y - origin.y
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
    origin.x = point.x
    origin.y = point.y

    active.value = true
  }

  const onPointerUp = () => {
    delta.x = 0
    delta.y = 0
    pinching.value = false
    active.value = false
  }

  const dispose = createCanvasEvents({
    validate: (e, valid) => {
      if (!valid) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    onPointerDown,
    onPointerUp,
    updateCursorPosition,
    onVisibilityChange: (isVisible: boolean) => {
      visible.value = isVisible
    }
  })

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
    point: readonly(point)
  }
})

export type PointerState = ReturnType<typeof usePointer>
