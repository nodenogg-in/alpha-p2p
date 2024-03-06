import {
  type Box,
  type Vec2,
  type Selection,
  type CanvasScreen,
  type Node,
  type NodeReference,
  defaultBox,
  defaultVec2
} from '../../schema'
import type { PointerState } from '../../app'
import type { Microcosm, EditableMicrocosmAPI } from '../../sync'
import { Tools, type Tool, type ToolName } from '../tools'
import { DEFAULT_TOOL } from '../constants'
import { deriveState, isString, parseFileToHTMLString, State } from '../../utils'
import { assignNodePositions } from '../layout'
import { CanvasInteraction } from './CanvasInteraction'
import { calculateBoundingBox, intersectBoxWithBox, intersectBoxWithPoint } from './intersection'
import { type BoxEdgeProximity, getCursorProximityToBox, scaleVec2 } from './geometry'
import { Instance } from '../../app/Instance'
import { CanvasData } from './CanvasData'
import { HighlightState } from './state/Highlight'
import { SelectionState } from './state/Selection'

type ActionState =
  | 'none'
  | 'draw-highlight'
  | 'move-selection'
  | 'resize-selection'
  | 'edit-selection'
  | 'draw-node'
  | 'move-canvas'

type ActionsState = {
  tool: ToolName
  state: ActionState
  focused: boolean
  selectedNodes: string[]
  editingNode: string | null
  edge: BoxEdgeProximity
}

export const defaultActionsState = (): ActionsState => ({
  tool: DEFAULT_TOOL,
  state: 'none',
  focused: false,
  selectedNodes: [],
  editingNode: null,
  edge: 'none'
})

type CanvasOptions = {
  persist?: string[]
}

type SelectionBox = CanvasScreen<Box>

const createGroupFromNodes = (node_ids: string[], nodes: NodeReference<'html'>[]): Box => {
  const boxes: Node<'html'>[] = []

  for (const node_id of node_ids) {
    const node = nodes.find(([id]) => id === node_id)
    if (node) {
      boxes.push(node[1])
    }
  }

  return boxes.length > 0 ? calculateBoundingBox(boxes) : defaultBox()
}

export class Canvas<M extends Microcosm = Microcosm> {
  protected microcosm: M
  public interaction: CanvasInteraction
  public action = new State({ initial: defaultActionsState, throttle: 16 })
  public selection = new SelectionState()
  public highlight = new HighlightState()
  public data: CanvasData
  public selectionGroup: State<SelectionBox>
  public readonly tools: ToolName[]

  constructor(microcosm: M, { persist }: CanvasOptions = {}) {
    this.microcosm = microcosm
    this.interaction = new CanvasInteraction(persist)
    this.data = new CanvasData(microcosm)
    this.tools = this.isEditable() ? ['select', 'move', 'new', 'connect'] : ['select', 'move']
    this.selectionGroup = deriveState(
      [this.selection, this.microcosm.api, this.interaction],
      ([selection]) => {
        const canvas = createGroupFromNodes(selection.nodes, this.microcosm.api.nodes('html'))
        return {
          canvas,
          screen: this.interaction.canvasToScreen(canvas)
        }
      }
    )

    const { ui } = Instance

    ui.window.onKey('pointer', (pointer) => {
      if (this.action.getKey('focused')) {
        this.update(pointer)
      }
    })

    ui.keyboard.onCommand({
      all: () => {
        if (this.isActive()) {
          this.select()
        }
      },
      h: () => {
        if (this.isActive()) {
          this.setTool('move')
        }
      },
      v: () => {
        if (this.isActive()) {
          this.setTool('select')
        }
      },
      n: () => {
        if (this.isActive()) {
          this.setTool('new')
        }
      },
      c: () => {
        if (this.isActive()) {
          this.setTool('connect')
        }
      },
      backspace: () => {
        if (this.isActive()) {
          console.log('backspace')
        }
      },
      space: () => {
        if (this.isActive()) {
          this.setTool('move')
        }
      }
    })
  }

  public isActive = () => this.microcosm.isActive()

  get toolbar() {
    return this.tools
      .map((tool) => [tool, Tools[tool]] as [ToolName, Tool])
      .filter(([, tool]) => !tool.hidden)
  }

  public setTool = (tool: ToolName) => {
    if (this.tools.includes(tool)) {
      this.action.set({ tool: tool || 'select' })
    }
  }

  public select = (node_ids: string[] = this.microcosm.api.nodes('html').map(([id]) => id)) => {
    // this.action.setKey('selectedNodes', node_ids)
    this.selection.setKey('nodes', node_ids)
  }

  public isTool = (...tools: ToolName[]): boolean => tools.includes(this.action.getKey('tool'))

  public start = (ps: PointerState) => {
    console.log('start')
    // const distance = touch ? pointer.state.touchDistance : undefined
    this.highlight.set(this.interaction.getHighlight(ps))
    const selection = this.interaction.getSelection(
      this.highlight.get(),
      this.microcosm.api.nodes('html'),
      10
    )

    const point = this.highlight.getKey('point')
    const group = this.selectionGroup.get()
    const action = this.action.get()

    if (this.isTool('select')) {
      // If a selection already exists, check if the point intersects the selection
      const intersectsSelection =
        selection.nodes.length > 0 && intersectBoxWithPoint(point.canvas, group.canvas, 10)

      if (intersectsSelection) {
        const edge = getCursorProximityToBox(point.canvas, this.selectionGroup.getKey('canvas'), 10)
        this.action.setKey('edge', edge)

        this.action.set({
          state: edge === 'none' ? 'move-selection' : 'resize-selection'
        })
      } else {
        this.selection.reset(true)
        this.action.set({
          edge: 'none',
          state: 'draw-highlight'
        })
      }
    } else if (this.isTool('move')) {
      this.action.set({
        state: 'move-canvas'
      })
    } else if (this.isTool('new')) {
      this.action.set({
        state: 'draw-node'
      })
    }

    // if (this.isTool('select', 'edit')) {
    //   const isSelection = selection.nodes.length > 0
    //   if (!isSelection) {
    //     this.action.set({
    //       selectedNodes: [],
    //       editingNode: null,
    //       action: 'none'
    //     })
    //   } else {
    //     if (action.selectedNodes.length === 1 && selection.target === action.selectedNodes[0]) {
    //       this.action.set({
    //         editingNode: action.selectedNodes[0]
    //       })
    //     } else if (
    //       selection.target &&
    //       action.selectedNodes.length >= 1 &&
    //       !action.selectedNodes.includes(selection.target) &&
    //       shiftKey
    //     ) {
    //       this.action.setKey('selectedNodes', [...action.selectedNodes, selection.target])
    //     } else {
    //       this.action.set({
    //         selectedNodes: selection.target ? [selection.target] : [],
    //         editingNode: null
    //       })
    //     }
    //   }
    // } else {
    //   this.action.set({
    //     action: 'none'
    //   })
    // }
    this.interaction.storeState()
  }

  public is = (state: ActionState) => this.action.getKey('state') === state

  public update = (pointer: PointerState) => {
    if (!this.action.getKey('focused')) {
      this.action.setKey('edge', 'none')
      // return
    }

    if (this.is('move-canvas')) {
      this.interaction.move(pointer.delta)
      return
    }

    if (this.is('none')) {
      const highlight = this.interaction.getHighlight(pointer)
      const selection = this.interaction.getSelection(
        highlight,
        this.microcosm.api.nodes('html'),
        10
      )
      this.highlight.set(highlight)
      this.selection.set(selection)
      const intersectsSelection =
        selection.nodes.length > 0 &&
        intersectBoxWithPoint(highlight.point.canvas, this.selectionGroup.get().canvas, 10)

      this.action.setKey(
        'edge',
        intersectsSelection
          ? getCursorProximityToBox(
              highlight.point.canvas,
              this.selectionGroup.getKey('canvas'),
              10
            )
          : 'none'
      )

      // this.selection.set(this.getSelection(pointer))
    } else if (this.is('draw-highlight')) {
      this.highlight.set(this.interaction.getHighlight(pointer))
      const selection = this.interaction.getSelection(
        this.highlight.get(),
        this.microcosm.api.nodes('html'),
        10
      )
      this.selection.set(selection)
    } else if (this.is('move-canvas')) {
      // console.log('move canvas')
      // this.interaction.move(pointer.delta)
    } else if (this.is('move-selection')) {
      const delta = scaleVec2(pointer.delta, 1 / this.interaction.getKey('transform').scale)
      this.microcosm.move(this.selection.getKey('nodes'), delta)
    } else if (this.is('resize-selection')) {
      // const dpos = {
      //   x: pointer.point.x - pointer.origin.x,
      //   y: pointer.point.y - pointer.origin.y
      // }

      const delta = scaleVec2(pointer.delta, 1 / this.interaction.getKey('transform').scale)
      this.microcosm.resize(
        this.selectionGroup.get().canvas,
        this.selection.getKey('nodes'),
        delta,
        this.action.getKey('edge')
      )
    }

    // const pt = this.selection.getKey('point')
    // const selection = this.getSelection(pointer)
    // const target = lastInArray(intersectPoint(pt.canvas, this.microcosm.api.nodes('html')))
    // this.selection.setKey('target', target)
    // this.action.setKey(
    //   'edge',
    //   getCursorProximityToBox(pt.canvas, this.selectionGroup.getKey('canvas'))
    // )
    // this.selection.set(selection)
    // if (this.action.getKey('focused')) {
    //   // console.log('update action')
    //   if (this.isEditable()) {
    //     // const targetNode = this.action.getKey('editingNode')
    //     if (pointer.hasDelta) {
    //       const delta = scaleVec2(pointer.delta, 1 / this.interaction.getKey('transform').scale)
    //       // const t = this.microcosm.api.node(targetNode, 'html')
    //       this.microcosm.move(selection.nodes, delta)
    //       // if (t) {
    //       //   this.microcosm.api.update([
    //       //     targetNode,
    //       //     'html',
    //       //     {
    //       //       x: t.x + delta.x,
    //       //       y: t.y + delta.y
    //       //     }
    //       //   ])
    //       // }
    //     }
    //   }
    //   const action = this.action.get()
    //   if (pointer.active) {
    //     // if (pointer.pinching) {
    //     //   pinch(pointer.touchDistance)
    //     // } else {
    //     // if (this.isTool(Tool.Select)) {
    //     //   if (this.state.action.action) {
    //     //     this.setKey('selection', this.getSelection(pointer))
    //     //   }
    //     // }
    //     if (this.isTool('move') && action.action) {
    //       this.interaction.move(pointer.delta)
    //     }
    //     // if (this.isTool(Tool.New) && this.state.action.action) {
    //     //   this.setKey('selection', this.getSelection(pointer))
    //     // }
    //   }
    // }
  }

  public finish = (pointer: PointerState) => {
    this.action.set({ state: 'none', edge: 'none' })
    this.selection.reset()
    console.log('finish!!')

    // if (!pointer) {
    //   return
    // }

    // const selection = this.selection.get()

    // if (this.isEditable() && this.isTool('new')) {
    //   const node = selection.box.canvas
    //   if (node.width > MINIMUM_NODE_SIZE.width && node.height > MINIMUM_NODE_SIZE.height) {
    //     this.microcosm.api.create({
    //       type: 'html',
    //       content: '',
    //       ...node
    //     })
    //   }
    // }

    // if (this.isTool('select')) {
    //   if (selection.nodes.length > 0) {
    //     this.action.setKey('selectedNodes', () => [...selection.nodes])
    //   }
    // }
    // this.action.setKey('action', 'none')
    // this.reset()
    this.interaction.storeState()
  }

  public onWheel = (e: WheelEvent) => {
    const point = {
      x: e.clientX,
      y: e.clientY
    }

    const delta = {
      x: e.deltaX,
      y: e.deltaY
    }

    if (delta.y % 1 === 0) {
      this.interaction.pan(delta)
    } else {
      this.interaction.scroll(point, delta)
    }
  }

  public onPointerOver = () => {
    this.action.setKey('focused', true)
  }
  public onPointerOut = () => {
    this.action.setKey('focused', false)
    // this.reset()
  }

  public onPointerDown = () => {
    this.start(Instance.ui.window.getKey('pointer'))
  }

  public onPointerUp = () => {
    this.finish(Instance.ui.window.getKey('pointer'))
  }

  public onFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (target && target.getAttribute('tabindex') === '0' && target.dataset.node_id) {
      event.preventDefault()
      target.focus({ preventScroll: true })
      const { node_id } = target.dataset
      console.log(node_id)
    }
  }

  public onDropFiles = async (files: File[] | null) => {
    if (this.isEditable() && files) {
      const canvas = this.interaction.get()
      const parsed = await Promise.all(files.map(parseFileToHTMLString))
      const nodes = parsed.filter(isString).map((content) => ({
        type: 'html',
        content
      }))

      const positionedNodes = assignNodePositions(canvas, nodes)
      this.microcosm.api.create(positionedNodes)
    }
  }

  public isBoxWithinViewport = (box: Box): boolean =>
    intersectBoxWithBox(box, this.interaction.getKey('viewport'))

  public isEditable = (): this is Canvas<Microcosm<EditableMicrocosmAPI>> =>
    this.microcosm.isEditable()

  public dispose = () => {
    this.interaction.dispose()
    this.selection.dispose()
    this.action.dispose()
    this.selectionGroup.dispose()
  }
}
