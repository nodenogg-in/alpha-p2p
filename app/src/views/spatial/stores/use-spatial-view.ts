import { defineStore } from 'pinia'
import { inject, reactive, readonly, ref } from 'vue'
import { type Box, type Transform, type Size, defaultTransform, defaultBox } from '../types'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'

export const useSpatialView = (microcosm_uri: string) =>
  defineStore(`spatial/${microcosm_uri}`, () => {
    const loaded = ref<boolean>(false)
    const transform = reactive<Transform>(defaultTransform())
    const dimensions = reactive<Box>(defaultBox())
    const previousTransform = reactive<Transform>(defaultTransform())
    const previousDistance = ref<number>(0)
    const action = ref<boolean>(false)

    const canvas = reactive<Size>({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    })

    const storePreviousState = (distance?: number) => {
      previousTransform.translate.x = transform.translate.x
      previousTransform.translate.y = transform.translate.y
      previousTransform.scale = transform.scale
      previousDistance.value = distance || previousDistance.value
    }

    const startAction = (distance?: number) => {
      action.value = true
      storePreviousState(distance)
    }

    const finishAction = () => {
      action.value = false
      storePreviousState()
    }

    const setTransform = (newTransform: Partial<Transform>) => {
      const limitX = (dimensions.width / 2) * (newTransform.scale || transform.scale)
      const limitY = (dimensions.height / 2) * (newTransform.scale || transform.scale)

      console.log(transform.translate.x, transform.translate.y)
      console.log(limitX, limitY)

      transform.translate.x = newTransform.translate?.x || transform.translate.x
      transform.translate.y = newTransform.translate?.y || transform.translate.y
      transform.scale = newTransform.scale || transform.scale
    }

    const setDimensions = (newDimensions: Box) => {
      dimensions.x = newDimensions.x
      dimensions.y = newDimensions.y
      dimensions.width = newDimensions.width
      dimensions.height = newDimensions.height

      // if (!loaded.value) {
      //   setTransform({
      //     scale: 1,
      //     translate: {
      //       x: -CANVAS_WIDTH / 2 + dimensions.width / 2,
      //       y: -CANVAS_HEIGHT / 2 + dimensions.height / 2
      //     }
      //   })
      // }
        loaded.value = true
    }

    return {
      previousTransform,
      previousDistance,
      startAction,
      finishAction,
      canvas: readonly(canvas),
      dimensions: readonly(dimensions),
      setTransform,
      setDimensions,
      transform: readonly(transform)
    }
  })()

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentView = () => inject<SpatialView>(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
