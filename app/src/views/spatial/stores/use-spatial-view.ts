import { defineStore } from 'pinia'
import { inject, onBeforeUnmount, reactive, readonly, ref } from 'vue'
import {
  type Box,
  type Transform,
  type Size,
  defaultTransform,
  defaultBox,
  type Point
} from '../types'
import { CANVAS_HEIGHT, CANVAS_WIDTH, GRID_UNIT } from '../constants'
import { calculateTranslation, getSelectionBox } from '../utils/interaction'
import { createKeybindings } from '@/utils/Keybindings'
import { clamp } from '../utils/number'
import type { Position } from '@vueuse/core'

export enum Tool {
  Move = 'move',
  Select = 'select',
  New = 'new'
}

export const isMoveTool = (mode: Tool): mode is Tool.Move => mode === Tool.Move
export const isSelectTool = (mode: Tool): mode is Tool.Select => mode === Tool.Select
export const isNewTool = (mode: Tool): mode is Tool.New => mode === Tool.New

const normalise = <T extends Box | Point>(point: T, offset: Box): T => ({
  ...point,
  x: point.x - offset.x,
  y: point.y - offset.y
})

export const createSpatialView = (microcosm_uri: string) =>
  defineStore(`spatial/${microcosm_uri}`, () => {
    const loaded = ref<boolean>(false)
    const transform = reactive<Transform>(defaultTransform())
    const dimensions = reactive<Box>(defaultBox())
    const previousTransform = reactive<Transform>(defaultTransform())
    const previousDistance = ref<number>(0)
    const action = ref<boolean>(false)
    const grid = ref<number>(GRID_UNIT)
    const selectionBox = ref<Box>(defaultBox())

    const tool = ref<Tool>(Tool.Select)

    const snapToGrid = (point: number) => {
      return Math.floor(point / grid.value) * grid.value
    }

    const transformPoint = (point: Point): Point => {
      const originX = -dimensions.width / 2
      const originY = -dimensions.height / 2

      const p = normalise(point, dimensions)

      const px = originX + p.x - transform.translate.x
      const py = originY + p.y - transform.translate.y

      let x = px / transform.scale
      let y = py / transform.scale

      x += canvas.width / 2
      y += canvas.height / 2

      return {
        x: snapToGrid(x),
        y: snapToGrid(y)
      }
    }

    const transformBox = (box: Box): Box => {
      const { x, y } = transformPoint(box)

      const width = box.width / transform.scale
      const height = box.height / transform.scale

      return {
        x,
        y,
        width: snapToGrid(width),
        height: snapToGrid(height)
      }
    }

    const inverseTransformPoint = (point: Point): Point => {
      // Move origin to center of canvas
      let x = point.x - canvas.width / 2
      let y = point.y - canvas.height / 2

      // Apply scale
      x *= transform.scale
      y *= transform.scale

      // Apply translation
      x += transform.translate.x
      y += transform.translate.y

      // Adjust origin back to the top-left corner of the container
      const originX = dimensions.width / 2
      const originY = dimensions.height / 2

      return {
        x: x + originX,
        y: y + originY
      }
    }

    const inverseTransformBox = (box: Box, scaled: boolean = true): Box => {
      const { x, y } = inverseTransformPoint({ x: box.x, y: box.y })

      // Apply scale to dimensions
      const width = box.width * (scaled ? transform.scale : 1.0)
      const height = box.height * (scaled ? transform.scale : 1.0)

      return {
        x,
        y,
        width,
        height
      }
    }

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

    const setSelection = (origin: Position, delta: Position) => {
      selectionBox.value = getSelectionBox(origin, delta)
    }
    const resetSelection = () => {
      selectionBox.value = defaultBox()
    }

    const startAction = (distance?: number) => {
      action.value = true
      storePreviousState(distance)
    }

    const finishAction = () => {
      action.value = false
      resetSelection()
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

    const update = () => {}

    onBeforeUnmount(unsubscribe)

    return {
      setTool,
      startAction,
      finishAction,
      setTransform,
      setDimensions,
      zoom,
      setSelection,
      update,
      transformPoint,
      transformBox,
      inverseTransformBox,
      inverseTransformPoint,
      grid: readonly(grid),
      tool: readonly(tool),
      selectionBox: readonly(selectionBox),
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
