import { defineStore } from 'pinia'
import { inject, onBeforeUnmount, reactive, readonly, ref } from 'vue'
import { type Box, type Transform, type Size, defaultTransform, defaultBox } from '../types'
import { CANVAS_HEIGHT, CANVAS_WIDTH, GRID_UNIT } from '../constants'
import { calculateTranslation } from '../utils/interaction'
import { createKeybindings } from '@/utils/Keybindings'
import { clamp } from '../utils/number'

export enum Tool {
  Move = 'move',
  Select = 'select',
  New = 'new'
}

export const isMoveTool = (mode: Tool): mode is Tool.Move => mode === Tool.Move
export const isSelectTool = (mode: Tool): mode is Tool.Select => mode === Tool.Select
export const isNewTool = (mode: Tool): mode is Tool.New => mode === Tool.New

export const createSpatialView = (microcosm_uri: string) =>
  defineStore(`spatial/${microcosm_uri}`, () => {
    const loaded = ref<boolean>(false)
    const transform = reactive<Transform>(defaultTransform())
    const dimensions = reactive<Box>(defaultBox())
    const previousTransform = reactive<Transform>(defaultTransform())
    const previousDistance = ref<number>(0)
    const action = ref<boolean>(false)
    const grid = ref<number>(GRID_UNIT)

    const tool = ref<Tool>(Tool.Select)

    const unsubscribe = createKeybindings({
      '$mod+C': () => {
        console.log('copy')
      },
      '$mod+X': () => {
        console.log('cut')
      },
      '$mod+V': () => {
        console.log('paste')
      },
      Escape: () => {
        tool.value = Tool.Select
      },
      n: () => {
        tool.value = Tool.New
      },
      v: () => {
        tool.value = Tool.Select
      },
      h: () => {
        tool.value = Tool.Move
      }
    })

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

    const setTransform = (newTransform: Partial<Transform> = {}) => {
      const x = newTransform.translate?.x || transform.translate.x
      const y = newTransform.translate?.y || transform.translate.y
      const scale = newTransform.scale || transform.scale

      const maxX = Math.max(0, (canvas.width * scale - dimensions.width) / 2)
      const maxY = Math.max(0, (canvas.height * scale - dimensions.height) / 2)

      const translateX = clamp(x, -maxX, maxX)
      const translateY = clamp(y, -maxY, maxY)

      transform.translate.x = translateX
      transform.translate.y = translateY
      transform.scale = newTransform.scale || transform.scale
    }

    const setDimensions = (newDimensions: Box) => {
      dimensions.x = newDimensions.x
      dimensions.y = newDimensions.y
      dimensions.width = newDimensions.width
      dimensions.height = newDimensions.height
      setTransform()
      loaded.value = true
    }

    const zoom = (newScale: number) => {
      // Calculate the translation adjustment
      const newTranslation = calculateTranslation(
        transform.scale,
        newScale,
        transform.translate,
        {
          x: dimensions.width / 2,
          y: dimensions.height / 2
        },
        dimensions
      )

      // Apply transforms
      setTransform({
        scale: newScale,
        translate: newTranslation
      })
    }

    const setTool = (newTool: Tool) => {
      tool.value = newTool
    }

    onBeforeUnmount(unsubscribe)

    return {
      setTool,
      startAction,
      finishAction,
      setTransform,
      setDimensions,
      zoom,
      grid: readonly(grid),
      tool: readonly(tool),
      previousTransform: readonly(previousTransform),
      previousDistance: readonly(previousDistance),
      active: readonly(action),
      canvas: readonly(canvas),
      dimensions: readonly(dimensions),
      transform: readonly(transform)
    }
  })()

export type SpatialView = ReturnType<typeof createSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () =>
  inject<SpatialView>(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
