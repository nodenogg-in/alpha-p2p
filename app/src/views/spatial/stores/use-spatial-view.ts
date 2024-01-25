import { inject, reactive, readonly, ref, watch } from 'vue'
import {
  type Box,
  type Transform,
  defaultTransform,
  defaultBox,
  type Point,
  isBox
} from '../SpatialView.types'
import { CANVAS_HEIGHT, CANVAS_WIDTH, GRID_UNIT, MAX_ZOOM, MIN_ZOOM } from '../constants'
import { calculateTranslation, calculateZoom, getSelectionBox } from '../utils/geometry'
import { clamp } from '../utils/number'
import { CanvasInteraction, type IntersectionData } from '../utils/CanvasInteraction'
import { useCursor } from './use-cursor'
import { isNumber } from '@/utils'
import type { BoxReference } from '../utils/intersection'
import { defineViewStore } from '@/utils/store'

export enum Tool {
  Move = 'move',
  Select = 'select',
  New = 'new',
  Connect = 'connect'
}

export const isMoveTool = (mode: Tool): mode is Tool.Move => mode === Tool.Move
export const isSelectTool = (mode: Tool): mode is Tool.Select => mode === Tool.Select
export const isNewTool = (mode: Tool): mode is Tool.New => mode === Tool.New
export const isConnectTool = (mode: Tool): mode is Tool.Connect => mode === Tool.Connect

export const createSpatialView = (microcosm_uri: string) => {
  const canvas = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT
  } as const

  const grid = GRID_UNIT

  return defineViewStore('spatial', microcosm_uri, () => {
    const loaded = ref<boolean>(false)
    const action = ref<boolean>(false)
    const transform = reactive<Transform>(defaultTransform())
    const container = reactive<Box>(defaultBox())
    const previous = ref<SpatialViewState>(capturePreviousTransform(transform))
    const selectionBox = reactive<Box>(defaultBox())
    const tool = ref<Tool>(Tool.Select)
    const cursor = useCursor()
    const intersections = new CanvasInteraction()

    const snapToGrid = (point: number) => {
      // return Math.floor(point / grid.value) * grid.value
      return Math.round(point)
    }

    const normalise = <T extends Box | Point>(point: T): T => ({
      ...point,
      x: point.x - container.x,
      y: point.y - container.y
    })

    const screenToCanvas = <T extends Point>(data: T): T extends Box ? Box : Point => {
      const originX = -container.width / 2
      const originY = -container.height / 2

      const p = normalise(data)

      const px = originX + p.x - transform.translate.x
      const py = originY + p.y - transform.translate.y

      let x = px / transform.scale
      let y = py / transform.scale

      x += canvas.width / 2
      y += canvas.height / 2

      x = snapToGrid(x)
      y = snapToGrid(y)

      if (isBox(data)) {
        const width = snapToGrid(data.width / transform.scale)
        const height = snapToGrid(data.height / transform.scale)
        return {
          x,
          y,
          width,
          height
        } as T extends Box ? Box : Point
      } else {
        return {
          x,
          y
        } as T extends Box ? Box : Point
      }
    }

    const canvasToScreen = <T extends Point>(
      data: T,
      scaled: boolean = true
    ): T extends Box ? Box : Point => {
      // Move origin to center of canvas
      let x = data.x - canvas.width / 2
      let y = data.y - canvas.height / 2

      // Apply scale
      x *= transform.scale
      y *= transform.scale

      // Apply translation
      x += transform.translate.x
      y += transform.translate.y

      // Adjust origin back to the top-left corner of the container
      x = x + container.width / 2
      y = y + container.height / 2

      if (isBox(data)) {
        // Apply scale to container
        const width = data.width * (scaled ? transform.scale : 1.0)
        const height = data.height * (scaled ? transform.scale : 1.0)
        return {
          x,
          y,
          width,
          height
        } as T extends Box ? Box : Point
      } else {
        return {
          x,
          y
        } as T extends Box ? Box : Point
      }
    }

    const setSelection = (origin: Point, delta: Point) => {
      const newBox = getSelectionBox(origin, delta)
      selectionBox.x = newBox.x
      selectionBox.y = newBox.y
      selectionBox.width = newBox.width
      selectionBox.height = newBox.height
    }

    const resetSelection = () => {
      selectionBox.x = 0
      selectionBox.y = 0
      selectionBox.width = 0
      selectionBox.height = 0
    }

    const startAction = (distance?: number) => {
      action.value = true
      cursor.startAction({ pinch: isNumber(distance) })
      previous.value = capturePreviousTransform(transform, distance)
    }

    const finishAction = () => {
      action.value = false
      resetSelection()
      previous.value = capturePreviousTransform(transform)
    }

    const setTransform = (newTransform: Partial<Transform> = {}) => {
      const x = newTransform.translate?.x || transform.translate.x
      const y = newTransform.translate?.y || transform.translate.y
      const scale = newTransform.scale || transform.scale

      const maxX = Math.max(0, (canvas.width * scale - container.width) / 2)
      const maxY = Math.max(0, (canvas.height * scale - container.height) / 2)

      const translateX = clamp(x, -maxX, maxX)
      const translateY = clamp(y, -maxY, maxY)

      transform.translate.x = translateX
      transform.translate.y = translateY
      transform.scale = scale
    }

    const setContainer = (element: HTMLElement) => {
      if (!element) {
        return
      }
      const { top: y, left: x, width, height } = element.getBoundingClientRect()

      container.x = x
      container.y = y
      container.width = width
      container.height = height

      setTransform()
      loaded.value = true
    }

    const zoom = (newScale: number) => {
      const newTranslation = calculateTranslation(
        transform.scale,
        newScale,
        transform.translate,
        {
          x: container.width / 2,
          y: container.height / 2
        },
        container
      )

      setTransform({
        scale: newScale,
        translate: newTranslation
      })
    }

    const pinch = (newDistance: number) => {
      const scaleFactor = newDistance / previous.value.distance
      setTransform({
        scale: previous.value.transform.scale * scaleFactor
      })
    }

    const move = (delta: Point) => {
      setTransform({
        translate: {
          x: previous.value.transform.translate.x + delta.x,
          y: previous.value.transform.translate.y + delta.y
        }
      })
    }

    const setTool = (newTool: Tool) => {
      tool.value = newTool
    }

    const scroll = (point: Point, delta: Point) => {
      if (!isMoveTool(tool.value) && delta.y % 1 === 0) {
        setTransform({
          translate: {
            x: transform.translate.x - delta.x,
            y: transform.translate.y - delta.y
          }
        })
        return
      }

      if (
        (transform.scale >= MAX_ZOOM && delta.y < 0) ||
        (transform.scale <= MIN_ZOOM && delta.y > 0)
      ) {
        return
      }

      const multiplier = 1
      // Calculate the scale adjustment
      const scrollAdjustment = Math.min(0.009 * multiplier * Math.abs(delta.y), 0.08)
      const scale = calculateZoom(transform.scale, Math.sign(delta.y), scrollAdjustment)

      // Apply transforms
      setTransform({
        scale,
        translate: calculateTranslation(
          transform.scale,
          scale,
          transform.translate,
          point,
          container
        )
      })
    }

    const selection = reactive<IntersectionData>({
      point: null,
      selection: {
        nodes: [],
        boundingBox: defaultBox()
      }
    })

    watch(cursor.touchPoint, () => {
      if (cursor.pinching) {
        pinch(cursor.touchDistance)
      } else {
        if (isSelectTool(tool.value)) {
          intersect(screenToCanvas(cursor.touchPoint), screenToCanvas(selectionBox)).then(
            handleSelection
          )
          if (action.value) {
            setSelection(cursor.origin, cursor.delta)
          }
        }
        if (isMoveTool(tool.value) && action.value) {
          move(cursor.delta)
        }
        if (isNewTool(tool.value) && action.value) {
          setSelection(cursor.origin, cursor.delta)
        }
      }
    })

    watch(tool, cursor.finishAction)

    const handleSelection = (data: Partial<IntersectionData> = {}) => {
      selection.point = data.point || null
      if (data.selection) {
        selection.selection.nodes = data.selection.nodes
        selection.selection.boundingBox = data.selection.boundingBox
      }
    }

    const setBoxes = (boxes: BoxReference[]) => intersections.setBoxes(boxes)

    const intersect = async (point: Point, b: Box) => intersections.intersect([point, [b, 0.001]])

    return {
      setTool,
      startAction,
      finishAction,
      setContainer,
      setSelection,
      canvasToScreen,
      screenToCanvas,
      normalise,
      zoom,
      move,
      pinch,
      scroll,
      grid,
      setBoxes,
      selection: selection,
      loaded: readonly(loaded),
      canvas: readonly(canvas),
      tool: readonly(tool),
      container: readonly(container),
      selectionBox: readonly(selectionBox),
      active: readonly(action),
      transform: readonly(transform)
    }
  })()
}

export const capturePreviousTransform = (
  transform: Transform,
  distance: number = 0
): SpatialViewState => ({
  transform: {
    translate: {
      x: transform.translate.x,
      y: transform.translate.y
    },
    scale: transform.scale
  },
  distance
})

export type SpatialViewState = {
  transform: Transform
  distance: number
}

export type SpatialView = ReturnType<typeof createSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () =>
  inject<SpatialView>(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
