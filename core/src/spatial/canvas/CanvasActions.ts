import { PointerState } from '../../app'
import { Box, CanvasScreen, Node, NodeReference, Vec2, defaultBox, defaultVec2 } from '../../schema'
import { State, deriveState } from '../../utils'
import { DEFAULT_TOOL } from '../constants'
import { ToolName } from '../tools'
import { BoxEdgeProximity, getBoxEdgeProximity, scaleVec2 } from './geometry'
import { Canvas } from './Canvas'
import { calculateBoundingBox, intersectBoxWithPoint } from './intersection'

type ActionState =
  | 'none'
  | 'draw-highlight'
  | 'move-selection'
  | 'resize-selection'
  | 'edit-selection'
  | 'draw-node'
  | 'move-canvas'

export type CanvasActionsState = {
  tool: ToolName
  state: ActionState
  edge: BoxEdgeProximity
  selection: {
    nodes: string[]
    target: string | null
  }
  highlight: {
    box: CanvasScreen<Box>
    point: CanvasScreen<Vec2>
  }
}

export type HighlightState = {
  box: CanvasScreen<Box>
  point: CanvasScreen<Vec2>
}

const defaultCanvasActionsState = (): CanvasActionsState => ({
  tool: DEFAULT_TOOL,
  state: 'none',
  edge: 'none',
  selection: {
    nodes: [],
    target: null
  },
  highlight: {
    box: {
      screen: defaultBox(),
      canvas: defaultBox()
    },
    point: {
      screen: defaultVec2(),
      canvas: defaultVec2()
    }
  }
})

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

type SelectionBox = CanvasScreen<Box>

export class CanvasActions<C extends Canvas> extends State<CanvasActionsState> {
  public selectionGroup: State<SelectionBox>

  constructor(protected canvas: C) {
    super({
      initial: defaultCanvasActionsState,
      throttle: 8
    })

    this.selectionGroup = deriveState(
      [this, this.canvas.microcosm.api, this.canvas.interaction],
      ([{ selection }]) => {
        const canvas = createGroupFromNodes(
          selection.nodes,
          this.canvas.microcosm.api.nodes('html')
        )
        return {
          canvas,
          screen: this.canvas.interaction.canvasToScreen(canvas)
        }
      }
    )
  }
  public reset = () => {
    this.set({
      ...this.initial()
    })
  }
  public is = (state: ActionState) => this.getKey('state') === state

  public rest = () => {
    this.setKey('edge', 'none')
  }
  public start = (ps: PointerState) => {
    // const distance = touch ? pointer.state.touchDistance : undefined
    this.setKey('highlight', this.canvas.interaction.getHighlight(ps))
    const selection = this.canvas.interaction.getSelection(
      this.getKey('highlight'),
      this.canvas.microcosm.api.nodes('html'),
      10
    )

    const { point } = this.getKey('highlight')
    const group = this.selectionGroup.get()
    const action = this.get()

    if (this.canvas.isTool('select')) {
      // If a selection already exists, check if the point intersects the selection
      const intersectsSelection =
        selection.nodes.length > 0 && intersectBoxWithPoint(point.canvas, group.canvas, 10)

      if (intersectsSelection) {
        const edge = getBoxEdgeProximity(point.canvas, this.selectionGroup.getKey('canvas'), 10)
        this.setKey('edge', edge)

        this.set({
          state: edge === 'none' ? 'move-selection' : 'resize-selection'
        })
      } else {
        this.set({
          selection: {
            nodes: [],
            target: null
          },
          edge: 'none',
          state: 'draw-highlight'
        })
      }
    } else if (this.canvas.isTool('move')) {
      this.set({
        state: 'move-canvas'
      })
    } else if (this.canvas.isTool('new')) {
      this.set({
        state: 'draw-node'
      })
    }

    this.canvas.interaction.storeState()
  }

  public update = (pointer: PointerState) => {
    if (this.is('move-canvas')) {
      this.canvas.interaction.move(pointer.delta)
      return
    }

    if (this.is('none')) {
      const highlight = this.canvas.interaction.getHighlight(pointer)
      const selection = this.canvas.interaction.getSelection(
        highlight,
        this.canvas.microcosm.api.nodes('html'),
        10
      )
      this.setKey('highlight', highlight)
      this.setKey('selection', selection)
      const intersectsSelection =
        selection.nodes.length > 0 &&
        intersectBoxWithPoint(highlight.point.canvas, this.selectionGroup.get().canvas, 10)

      this.setKey(
        'edge',
        intersectsSelection
          ? getBoxEdgeProximity(highlight.point.canvas, this.selectionGroup.getKey('canvas'), 10)
          : 'none'
      )

      // this.selection.set(this.getSelection(pointer))
    } else if (this.is('draw-highlight')) {
      this.setKey('highlight', this.canvas.interaction.getHighlight(pointer))
      const selection = this.canvas.interaction.getSelection(
        this.getKey('highlight'),
        this.canvas.microcosm.api.nodes('html'),
        10
      )
      this.setKey('selection', selection)
    } else if (this.is('move-canvas')) {
      // console.log('move canvas')
      // this.interaction.move(pointer.delta)
    } else if (this.is('move-selection')) {
      const delta = scaleVec2(pointer.delta, 1 / this.canvas.interaction.getKey('transform').scale)
      this.canvas.microcosm.move(this.getKey('selection').nodes, delta)
    } else if (this.is('resize-selection')) {
      const delta = scaleVec2(pointer.delta, 1 / this.canvas.interaction.getKey('transform').scale)
      this.canvas.microcosm.resize(
        this.selectionGroup.get().canvas,
        this.getKey('selection').nodes,
        delta,
        this.getKey('edge')
      )
    }
  }

  public finish = (pointer: PointerState) => {
    this.set({ state: 'none', edge: 'none', selection: { nodes: [], target: null } })
    console.log('finish!!')

    this.canvas.interaction.storeState()
  }
}
