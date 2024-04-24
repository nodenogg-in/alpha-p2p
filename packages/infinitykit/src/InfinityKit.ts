import type { Box } from '@figureland/mathkit/box'
import { createSubscriptions, manager, signalObject } from '@figureland/statekit'
import { entries } from '@figureland/typekit'

import type { BoxReference } from './schema/spatial.schema'
import type { PointerState } from './schema/pointer.schema'
import type { ToolSet } from './tools'
import { createCanvas, type Canvas, type CanvasOptions } from './create-canvas'
import { intersectBoxWithBox } from './utils/intersection'
import { createCanvasActions, type CanvasActions } from './CanvasActions'

export interface API {
  boxes: <B extends BoxReference = BoxReference>() => (B extends BoxReference ? BoxReference : B)[]
}

export interface EditableAPI extends API {
  create: (boxes: Box[]) => void
}

export const createInfinityKit = <A extends API = API, T extends ToolSet = ToolSet>(
  api: A,
  { tools, canvas = {} }: { tools: T; canvas?: CanvasOptions }
) => {
  const { use, dispose } = manager()
  const subscriptions = use(createSubscriptions())
  const interaction = use(createCanvas(canvas))
  const state = use(signalObject({ focused: false }))

  return {
    dispose
  }
}

export class InfinityKit<A extends API = API, T extends ToolSet = ToolSet> {
  public subscriptions = createSubscriptions()
  public interaction: Canvas
  public action: CanvasActions
  public readonly tools: T
  public state = signalObject({ focused: false })

  constructor(
    public readonly api: A,
    { tools, canvas = {} }: { tools: T; canvas?: CanvasOptions }
  ) {
    this.tools = tools
    this.interaction = createCanvas(canvas)
    this.action = createCanvasActions(this)

    this.subscriptions.add(this.interaction.dispose, this.action.dispose)
  }

  public toolbar = () => entries(this.tools).filter(([_, tool]) => !tool.hidden)

  public hasTool = (tool: keyof T) => !!this.tools[tool]

  public setTool = (tool: keyof T) => {
    if (this.hasTool(tool)) {
      this.action.state.set({ tool: (tool as string) || 'select' })
    }
  }

  public select = (boxes: string[] = this.api.boxes().map(([id]) => id)) =>
    this.action.state.key('selection').set({ boxes })

  public isTool = (...tools: (keyof T)[]): boolean =>
    tools.includes(this.action.state.key('tool').get())

  public onWheel = (e: WheelEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.focus()
    }

    const pt = {
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
      this.interaction.scroll(pt, delta)
    }
  }

  public update = (pointer: PointerState) => {
    if (this.state.key('focused').get()) {
      this.action.update(pointer)
    }
  }

  public onPointerOver = () => {
    this.state.set({ focused: true })
  }
  public onPointerOut = () => {
    this.state.set({ focused: false })
  }

  public onPointerDown = (pointerState: PointerState, e: PointerEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.focus()
    }
    this.action.start(pointerState)
  }

  public onPointerUp = (pointerState: PointerState) => {
    this.action.finish(pointerState)
  }

  public onFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (target && target.getAttribute('tabindex') === '0') {
      event.preventDefault()
      target.focus({ preventScroll: true })
    }
  }

  public isBoxWithinViewport = <B extends BoxReference>(box: B): boolean =>
    intersectBoxWithBox(
      box[1],
      this.interaction.transform.screenToCanvas(this.interaction.viewport.get())
    )

  public dispose = () => {
    this.subscriptions.dispose()
  }
}
