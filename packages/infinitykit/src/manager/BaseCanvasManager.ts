import { signal, type Signal, Manager } from '@figureland/statekit'
import type { PointerState } from '@figureland/toolkit'
import type { Box, Vector2 } from '@figureland/mathkit/box'
import { Canvas, type CanvasOptions } from '../Canvas'
import type { PersistenceName } from '@figureland/statekit/typed-local-storage'
import type { QueryAPI } from '../query/query-api'
import { DefaultTools, defaultTools } from './default-tools'

export type ActionType = {
  type: string
  state: any
}

export type DefaultActions =
  | {
      type: 'idle'
      state: null
    }
  | {
      type: 'select'
      state: Box
    }
  | {
      type: 'pan'
      state: Vector2
    }
  | {
      type: 'draw'
      state: [Box, Vector2[]]
    }
  | {
      type: 'move'
      state: Vector2
    }
  | {
      type: 'resize'
      state: Box
    }

type CanvasManagerState<ID extends string = string> = {
  selection: ID[]
}

export class CanvasManager<API extends QueryAPI = QueryAPI> extends Manager {
  public readonly canvas: Canvas
  public tools: Signal<DefaultTools>
  public tool: Signal<keyof DefaultTools>
  public state: Signal<CanvasManagerState>

  constructor(
    public api: API,
    {
      initialCanvasState,
      persistence
    }: {
      initialCanvasState?: Partial<CanvasOptions>
      persistence?: PersistenceName
    }
  ) {
    super()
    this.tool = this.use(signal<keyof DefaultTools>(() => 'select'))
    this.tools = this.use(signal(() => defaultTools))
    this.state = this.use(
      signal<CanvasManagerState>(() => ({
        selection: []
      }))
    )
    this.canvas = this.use(
      new Canvas({
        options: initialCanvasState,
        persistence
      })
    )
  }

  public setTool = (tool: keyof DefaultTools) => {
    if (tool !== this.tool.get()) {
      this.onDeselect()
      this.tool.set(tool)
      this.onSelect()
    }
  }

  public getActiveTool = () => this.tools.get()[this.tool.get()]

  public onPointerDown = (p: PointerState) => {
    const action = this.getActiveTool().onPointerDown?.(this, p)
    if (action) {
      this.handleAction(action)
    }
  }

  public onPointerMove = (p: PointerState) => {
    const action = this.getActiveTool().onPointerMove?.(this, p)
    if (action) {
      this.handleAction(action)
    }
  }

  public onPointerUp = (p: PointerState) => {
    const action = this.getActiveTool().onPointerUp?.(this, p)
    if (action) {
      this.handleAction(action)
    }
  }

  public onWheel = (p: PointerState) => {
    const action = this.getActiveTool().onWheel?.(this, p)
    if (action) {
      this.handleAction(action)
    }
  }

  public onSelect = () => {
    const action = this.getActiveTool().onSelect?.(this)
    if (action) {
      this.handleAction(action)
    }
  }

  public onDeselect = () => {
    const action = this.getActiveTool().onDeselect?.(this)
    if (action) {
      this.handleAction(action)
    }
  }

  public handleAction = (action: DefaultActions) => {
    switch (action.type) {
      case 'idle':
        console.log('cm:idle')
        break
      case 'select':
        console.log('cm:select')
        break
      case 'pan':
        console.log('cm:move-canvas')
        break
      case 'draw':
        console.log('cm:draw-entity')
        break
      case 'move':
        console.log('cm:move-entity')
        break
      case 'resize':
        console.log('cm:resize-entity')
        break
      default:
        console.log('Unknown action type')
    }
  }
}

// type CanvasManagerState<ID extends string = string> = {
//   selection: ID[]
// }

// type CanvasManagerConstructor = {
//   initialCanvasState?: Partial<CanvasOptions>
//   persistence?: PersistenceName
// }

// export class CanvasManager<API extends QueryAPI> extends BaseCanvasManager<typeof defaultTools> {
//   constructor(
//     private api: API,
//     { persistence, initialCanvasState }: CanvasManagerConstructor
//   ) {
//     super({
//       tools: defaultTools,
//       initialTool: 'select',
//       persistence,
//       initialCanvasState,
//       state: (): CanvasManagerState => ({
//         selection: []
//       })
//     })
//   }
// }
