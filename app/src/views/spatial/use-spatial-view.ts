import { inject, reactive, readonly, ref, watch } from 'vue'
import { isString } from '@tiptap/vue-3'
import { defineStore } from 'pinia'

import {
  getSelectionBox,
  defaultCanvasState,
  select,
  type CanvasState
} from 'nodenoggin-core/canvas'
import {
  defaultBox,
  Tool,
  interact,
  type Transform,
  type Box,
  type Point,
  type IntersectionResult
} from 'nodenoggin-core/canvas'

import { useApp, usePointer, type MicrocosmStore } from '@/state'

type Selection = IntersectionResult & {
  area: Box
}
export const createSpatialView = (microcosm_uri: string, microcosm: MicrocosmStore) => {
  return defineStore(`view/spatial/${microcosm_uri}`, () => {
    const pointer = usePointer()
    const app = useApp()

    const canvas = reactive<CanvasState>(defaultCanvasState())
    const action = ref<boolean>(false)
    const selectedNodes = ref<string[]>([])
    const editingNode = ref<string | null>(null)

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

    const normalise = <T extends Box | Point>(point: T): T => interact.normalise(canvas, point)

    const screenToCanvas = <T extends Point>(data: T): T extends Box ? Box : Point =>
      interact.canvasToScreen(canvas, data)

    const canvasToScreen = <T extends Point>(
      data: T,
      scaled: boolean = true
    ): T extends Box ? Box : Point => interact.canvasToScreen(canvas, data, scaled)

    const setTransform = (newTransform: Transform = canvas.transform) => {
      canvas.transform.translate.x = newTransform.translate.x
      canvas.transform.translate.y = newTransform.translate.y
      canvas.transform.scale = newTransform.scale
    }

    const setContainer = ({ x, y, width, height }: Box) => {
      canvas.container.x = x
      canvas.container.y = y
      canvas.container.width = width
      canvas.container.height = height

      setTransform()

      if (!canvas.loaded) {
        canvas.loaded = true
      }
    }

    const zoom = (newScale: number) => setTransform(interact.zoom(canvas, newScale))

    const pinch = (newDistance: number) => setTransform(interact.pinch(canvas, newDistance))

    const move = (delta: Point) => setTransform(interact.move(canvas, delta))

    const setTool = (newTool?: Tool) => (canvas.tool = newTool || Tool.Select)

    const scroll = (point: Point, delta: Point) =>
      setTransform(interact.scroll(canvas, point, delta))

    const isTool = (...tool: Tool[]) => interact.isTool(canvas, ...tool)

    const handleSelection = (data: Partial<IntersectionResult> = {}) => {
      selection.point = data.point || null
      if (data.selection) {
        selection.selection.nodes = data.selection.nodes
        selection.selection.group = data.selection.group
      }
    }

    const setSelection = (origin: Point, delta: Point) => {
      const newBox = getSelectionBox(origin, delta)
      selection.area.x = newBox.x
      selection.area.y = newBox.y
      selection.area.width = newBox.width
      selection.area.height = newBox.height
    }

    const resetSelection = () => {
      selection.area.x = 0
      selection.area.y = 0
      selection.area.width = 0
      selection.area.height = 0
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
      canvas.tool = editingNode.value ? Tool.Edit : Tool.Select
    }

    const startAction = (
      e: MouseEvent | TouchEvent,
      { shiftKey, touch = false }: { shiftKey?: boolean; touch?: boolean } = {}
    ) => {
      console.log(`startAction ${touch ? 'touch' : 'mouse'}`)

      const distance = touch ? pointer.touchDistance : undefined

      if (isTool(Tool.Select, Tool.Edit)) {
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
      canvas.previous = interact.getCurrentState(canvas)
    }
    // tool: select
    // type:
    const updateAction = () => {
      if (pointer.active) {
        // if (pointer.pinching) {
        //   pinch(pointer.touchDistance)
        // } else {
        if (isTool(Tool.Select)) {
          const s = select(
            microcosm.getAllNodes(),
            interact.screenToCanvas(canvas, pointer.touchPoint),
            interact.screenToCanvas(canvas, selection.area)
          )
          handleSelection(s)
          if (action.value) {
            setSelection(pointer.origin, pointer.delta)
          }
        }
        if (isTool(Tool.Move) && action.value) {
          move(pointer.delta)
        }
        if (isTool(Tool.New) && action.value) {
          setSelection(pointer.origin, pointer.delta)
        }
      }
    }

    const finishAction = (
      e: MouseEvent | TouchEvent,
      { touch, shiftKey }: { touch?: boolean; shiftKey?: boolean } = {}
    ) => {
      console.log(`startAction ${touch ? 'touch' : 'mouse'}`)
      if (isTool(Tool.Select)) {
        if (selection.selection.nodes.length > 0) {
          selectedNodes.value = selection.selection.nodes
        }
      }
      action.value = false
      resetSelection()
      canvas.previous = interact.getCurrentState(canvas)
    }

    const getViewCenter = () => interact.getViewCenter(canvas)

    watch(pointer.touchPoint, updateAction)

    return {
      microcosm_uri,
      setTool,
      startAction,
      finishAction,
      setContainer,
      canvasToScreen,
      screenToCanvas,
      getViewCenter,
      normalise,
      zoom,
      move,
      pinch,
      scroll,
      isTool,
      selectedNodes,
      editingNode,
      selection: readonly(selection),
      active: readonly(action),
      canvas: readonly(canvas)
    }
  })()
}

export type SpatialViewState = {
  transform: Transform
  distance: number
}

export type SpatialView = ReturnType<typeof createSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () =>
  inject<SpatialView>(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
