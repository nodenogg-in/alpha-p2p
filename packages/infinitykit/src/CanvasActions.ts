import {
  createEvents,
  machine,
  signal,
  signalObject,
  manager,
  Signal,
  Events,
  SignalObject
} from '@figureland/statekit'
import { type PointerState } from '@figureland/toolkit/pointer'
import { vector2, type Vector2 } from '@figureland/mathkit/vector2'
import { box, type Box } from '@figureland/mathkit/box'

import { type CanvasScreen, type BoxReference } from './schema/spatial.schema'
import { DEFAULT_TOOL } from './constants'
import { type BoxEdgeProximity, getBoxEdgeProximity } from './utils/geometry'
import { type API, InfinityKit } from './InfinityKit'
import { calculateBoundingBox, intersectBoxWithPoint } from './utils/intersection'
import { type ToolSet } from '.'

const createStateMachine = () =>
  machine(
    'idle',
    {
      idle: {
        on: {
          brush: 'brushing',
          move: 'moving',
          resize: 'resizing',
          'draw-node': 'drawing-node',
          'draw-region': 'drawing-region'
        }
      },
      brushing: {
        on: {
          finish: 'idle'
        }
      },
      moving: {
        on: {
          finish: 'idle'
        }
      },
      resizing: {
        on: {
          finish: 'idle'
        }
      },
      'drawing-node': {
        on: {
          finish: 'idle'
        }
      },
      'drawing-region': {
        on: {
          finish: 'idle'
        }
      }
    },
    () => ({ x: 1, y: 2 })
  )

type ActionState =
  | 'none'
  | 'draw-highlight'
  | 'move-selection'
  | 'resize-selection'
  | 'edit-selection'
  | 'draw-box'
  | 'move-canvas'

export type CanvasActionsState = {
  tool: string
  state: ActionState
  edge: BoxEdgeProximity
  selection: {
    boxes: string[]
    target: string | null
  }
  highlight: {
    box: CanvasScreen<Box>
    point: CanvasScreen<Vector2>
  }
}

export type HighlightState = {
  box: CanvasScreen<Box>
  point: CanvasScreen<Vector2>
}

const defaultCanvasActionsState = (): CanvasActionsState => ({
  tool: DEFAULT_TOOL,
  state: 'none',
  edge: 'none',
  selection: {
    boxes: [],
    target: null
  },
  highlight: {
    box: {
      screen: box(),
      canvas: box()
    },
    point: {
      screen: vector2(),
      canvas: vector2()
    }
  }
})

const createGroupFromBoxes = (box_ids: string[], references: BoxReference[]): Box => {
  const boxes: Box[] = []

  for (const id of box_ids) {
    const box = references.find(([n_id]) => n_id === id)
    if (box) {
      boxes.push(box[1])
    }
  }

  return boxes.length > 0 ? calculateBoundingBox(boxes) : box()
}

type SelectionBox = CanvasScreen<Box>

export type InfinityKitEvents = {
  create: Box[]
}

export const createCanvasActions = <A extends API, T extends ToolSet>(
  kit: InfinityKit<A, T>
): CanvasActions => {
  const { use, dispose } = manager()

  const state = use(signalObject(defaultCanvasActionsState()))
  const events = use(createEvents<InfinityKitEvents>())
  const machine = use(createStateMachine())

  const selectionGroup = use(
    signal((get) => {
      const selection = get(state.key('selection'))
      get(kit.interaction.viewport)
      const canvas = createGroupFromBoxes(selection.boxes, kit.api.boxes())
      return {
        canvas,
        screen: kit.interaction.transform.canvasToScreen(canvas)
      }
    })
  )

  const reset = () => {
    state.set({
      ...defaultCanvasActionsState()
    })
  }

  const is = (s: ActionState) => state.key('state').get() === s

  const rest = () => {
    state.key('edge').set('none')
  }

  const start = (ps: PointerState) => {
    // state.key('highlight').set(kit.interaction.getHighlight(ps))
    // const selection = kit.interaction.getSelection(state.key('highlight').get(), kit.api.boxes())

    // if (machine.is('idle')) {
    //   machine.send('brush')
    // }

    // const { point } = state.key('highlight').get()
    // const group = selectionGroup.get()
    // // const action = state.get()

    // if (kit.isTool('select')) {
    //   // If a selection already exists, check if the point intersects the selection
    //   const intersectsSelection =
    //     selection.boxes.length > 0 && intersectBoxWithPoint(point.canvas, group.canvas, 10)

    //   if (intersectsSelection) {
    //     const edge = getBoxEdgeProximity(point.canvas, selectionGroup.get().canvas, 10)
    //     state.key('edge').set(edge)

    //     state.set({
    //       state: edge === 'none' ? 'move-selection' : 'resize-selection'
    //     })
    //   } else {
    //     state.set({
    //       selection: {
    //         boxes: [],
    //         target: null
    //       },
    //       edge: 'none',
    //       state: 'draw-highlight'
    //     })
    //   }
    // } else if (kit.isTool('move')) {
    //   state.set({
    //     state: 'move-canvas'
    //   })
    // } else if (kit.isTool('new')) {
    //   state.set({
    //     state: 'draw-box'
    //   })
    // }

    // kit.interaction.transform.storePrevious()
  }

  const update = (pointer: PointerState) => {
    // console.log('========')
    // if (machine.is('idle')) {
    //   return
    // } else if (machine.is('brushing')) {
    //   machine.send('brush', { x: 0 })
    // }
    // if (is('move-canvas')) {
    //   kit.interaction.move(pointer.delta)
    //   return
    // }

    if (is('none')) {
      // const highlight = kit.interaction.getHighlight(pointer)
      // const selection = kit.interaction.getSelection(highlight, kit.api.boxes(), 10)
      // state.key('highlight').set(highlight)
      // state.key('selection').set(selection)
      // const intersectsSelection =
      //   selection.boxes.length > 0 &&
      //   intersectBoxWithPoint(highlight.point.canvas, selectionGroup.get().canvas, 10)

      // state
      //   .key('edge')
      //   .set(
      //     intersectsSelection
      //       ? getBoxEdgeProximity(highlight.point.canvas, selectionGroup.get().canvas, 10)
      //       : 'none'
      //   )

      // selection.set(getSelection(pointer))
    } else if (is('draw-highlight')) {
      // state.key('highlight').set(kit.interaction.getHighlight(pointer))
      // const selection = kit.interaction.getSelection(
      //   state.key('highlight').get(),
      //   kit.api.boxes(),
      //   10
      // )
      // state.key('selection').set(selection)
    } else if (is('move-canvas')) {
      // console.log('move canvas')
      kit.interaction.move(pointer.delta)
    } else if (is('move-selection')) {
      // const delta = scalePoint(pointer.delta, 1 / kit.interaction.key('transform').get().scale)
      // kit.Microcosm.move(state.getKey('selection').boxes, delta)
    } else if (is('resize-selection')) {
      // const delta = scalePoint(pointer.delta, 1 / kit.interaction.key('transform').get().scale)
      // kit.Microcosm.resize(
      //   selectionGroup.get().canvas,
      //   state.getKey('selection').boxes,
      //   delta,
      //   state.getKey('edge')
      // )
    }
  }

  const finish = (_pointer: PointerState) => {
    state.set({ state: 'none', edge: 'none', selection: { boxes: [], target: null } })
    // console.log('finish!!')

    kit.interaction.transform.storePrevious()
  }

  return {
    dispose,
    state,
    events,
    machine,
    selectionGroup,
    reset,
    is,
    rest,
    start,
    update,
    finish
  }
}

export type CanvasActions = {
  dispose: () => void
  state: SignalObject<CanvasActionsState>
  events: Events<InfinityKitEvents>
  machine: ReturnType<typeof createStateMachine>
  selectionGroup: Signal<SelectionBox>
  reset: () => void
  is: (state: ActionState) => boolean
  rest: () => void
  start: (ps: PointerState) => void
  update: (pointer: PointerState) => void
  finish: (pointer: PointerState) => void
}
