import { inject, reactive, readonly, ref, watch } from 'vue'
import { isString } from '@tiptap/vue-3'
import { defineStore } from 'pinia'

import {
  GRID_UNIT as grid,
  MAX_ZOOM,
  MIN_ZOOM,
  calculateTranslation,
  calculateZoom,
  getSelectionBox,
  clamp
} from 'nodenoggin-core/canvas'
import { useApp, usePointer, type MicrocosmStore } from '@/state'
import { localReactive } from '@/utils/hooks/use-local-storage'
import {
  transformSchema,
  defaultTransform,
  defaultBox,
  isBox,
  Tool,
  isMoveTool,
  isSelectTool,
  isNewTool,
  isEditTool,
  type Transform,
  type Box,
  type Point,
  type IntersectionResult
} from 'nodenoggin-core/canvas'

type Selection = IntersectionResult & {
  area: Box
}

const VIEW_NAME = 'spatial' as const

export const createSpatialView = (microcosm_uri: string, microcosm: MicrocosmStore) => {
  return defineStore(`view/spatial/${microcosm_uri}`, () => {
    const pointer = usePointer()
    const app = useApp()

    const loaded = ref<boolean>(false)
    const action = ref<boolean>(false)
    const selectedNodes = ref<string[]>([])
    const editingNode = ref<string | null>(null)

    const transform = localReactive({
      name: [VIEW_NAME, microcosm_uri, 'transform'],
      schema: transformSchema,
      defaultValue: defaultTransform(),
      interval: 100
    })

    const container = reactive<Box>(defaultBox())
    const previous = ref<SpatialViewState>(capturePreviousTransform(transform))
    const selectionBox = reactive<Box>(defaultBox())
    const tool = ref<Tool>(Tool.Select)

    const selection = reactive<Selection>({
      point: null,
      selection: {
        nodes: [],
        group: defaultBox()
      },
      area: defaultBox()
    })

    app.onKeyCommand({
      h: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          setTool(Tool.Move)
        }
      },
      v: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          setTool(Tool.Select)
        }
      },
      n: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          setTool(Tool.New)
        }
      },
      c: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          setTool(Tool.Connect)
        }
      }
    })

    const snapToGrid = (point: number) => {
      // return Math.round(point / grid) * grid
      return Math.floor(point)
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

      x += container.width / 2
      y += container.height / 2

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
      let x = data.x - container.width / 2
      let y = data.y - container.height / 2

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

    const setTransform = (newTransform: Partial<Transform> = {}) => {
      const x = newTransform.translate?.x || transform.translate.x
      const y = newTransform.translate?.y || transform.translate.y
      const scale = newTransform.scale || transform.scale

      // const maxX = Math.max(0, (canvas.width * scale - container.width) / 2)
      // const maxY = Math.max(0, (canvas.height * scale - container.height) / 2)
      const maxX = Infinity
      const maxY = Infinity

      const translateX = clamp(x, -maxX, maxX)
      const translateY = clamp(y, -maxY, maxY)

      transform.translate.x = translateX
      transform.translate.y = translateY
      transform.scale = scale
    }

    const setContainer = ({ x, y, width, height }: Box) => {
      container.x = x
      container.y = y
      container.width = width
      container.height = height

      setTransform()
      if (!loaded.value) {
        loaded.value = true
      }
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

    const setTool = (newTool?: Tool) => {
      tool.value = newTool || Tool.Select
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

    const handleSelection = (data: Partial<IntersectionResult> = {}) => {
      selection.point = data.point || null
      if (data.selection) {
        selection.selection.nodes = data.selection.nodes
        selection.selection.group = data.selection.group
      }
      selection.area = selectionBox
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

    const setEditing = (node_id?: string | null) => {
      if (isString(node_id)) {
        const target = microcosm.getNode(node_id)
        if (target) {
          editingNode.value = node_id
        } else {
          editingNode.value = null
        }
      } else {
        editingNode.value = null
      }
      tool.value = editingNode.value ? Tool.Edit : Tool.Select
    }

    const startAction = (
      e: MouseEvent | TouchEvent,
      { shiftKey, touch = false }: { shiftKey?: boolean; touch?: boolean } = {}
    ) => {
      console.log(`startAction ${touch ? 'touch' : 'mouse'}`)

      const distance = touch ? pointer.touchDistance : undefined

      if (isSelectTool(tool.value) || isEditTool(tool.value)) {
        const isSelection = !!selection.point
        if (!isSelection) {
          selectedNodes.value = []
          setEditing(null)
          action.value = true
        } else {
          if (selectedNodes.value.length === 1 && selection.point === selectedNodes.value[0]) {
            setEditing(selectedNodes.value[0])
          } else if (
            selectedNodes.value.length >= 1 &&
            !selectedNodes.value.includes(selection.point as string) &&
            shiftKey
          ) {
            selectedNodes.value = [...selectedNodes.value, selection.point as string]
          } else {
            selectedNodes.value = selection.point ? [selection.point] : []
            setEditing(null)
          }
        }
      } else {
        action.value = true
      }
      // pointer.startAction({ pinch: isNumber(distance) })
      previous.value = capturePreviousTransform(transform, distance)
    }
    // tool: select
    // type:
    const updateAction = () => {
      if (pointer.active) {
        // if (pointer.pinching) {
        //   pinch(pointer.touchDistance)
        // } else {
        if (isSelectTool(tool.value)) {
          microcosm
            .intersect(screenToCanvas(pointer.touchPoint), screenToCanvas(selectionBox))
            .then(handleSelection)
          if (action.value) {
            setSelection(pointer.origin, pointer.delta)
          }
        }
        if (isMoveTool(tool.value) && action.value) {
          move(pointer.delta)
        }
        if (isNewTool(tool.value) && action.value) {
          setSelection(pointer.origin, pointer.delta)
        }
      }
    }

    const finishAction = (
      e: MouseEvent | TouchEvent,
      { touch, shiftKey }: { touch?: boolean; shiftKey?: boolean } = {}
    ) => {
      console.log(`startAction ${touch ? 'touch' : 'mouse'}`)
      if (isSelectTool(tool.value)) {
        if (selection.selection.nodes.length > 0) {
          selectedNodes.value = selection.selection.nodes
        }
      }
      action.value = false
      resetSelection()
      previous.value = capturePreviousTransform(transform)
    }

    watch(pointer.touchPoint, updateAction)

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
      selectedNodes,
      editingNode,
      selection: selection,
      loaded: readonly(loaded),
      tool: readonly(tool),
      container: readonly(container),
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

export const getViewCenter = (view: SpatialView) =>
  view.screenToCanvas({
    x: view.container.x + view.container.width / 2,
    y: view.container.y + view.container.height / 2
  })
