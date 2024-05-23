import { signalObject, PersistenceName, signal, Manager } from '@figureland/statekit'
import type { PointerState } from '@figureland/toolkit/pointer'
import { Canvas, CanvasOptions } from './Canvas'
import type { Tool, ToolSet } from './tools'
import { entries } from '@figureland/typekit'

type CanvasActionsState<T> = {
  tool: T
  state: 'none' | 'selecting'
  focus: boolean
  hover: boolean
}

const defaultActionsState = (): CanvasActionsState<any> => ({
  tool: 'select',
  state: 'none',
  focus: false,
  hover: false
})

type ActionConstructor<T> = {
  tools: T
  canvas?: CanvasOptions
  persistence?: PersistenceName
}

export class Actions<T extends ToolSet, ToolName extends keyof T> extends Manager {
  public readonly canvas: Canvas
  public readonly state = this.use(
    signalObject<CanvasActionsState<ToolName>>(defaultActionsState())
  )
  public tools = signal<T>(() => ({}) as T)

  constructor({ tools, persistence, canvas }: ActionConstructor<T>) {
    super()
    this.canvas = this.use(
      new Canvas({
        persistence,
        options: canvas
      })
    )
    this.setTools(tools)
  }

  public setTools = (toolset: T) => this.tools.set(structuredClone(toolset))

  public hasTool = (tool: ToolName) => !!this.tools.get()[tool]

  public setTool = (tool: ToolName) => {
    if (this.hasTool(tool)) {
      this.state.set({ tool })
    }
  }

  public isTool = (...tools: (keyof T)[]): boolean => tools.includes(this.state.key('tool').get())

  public start = (pointer: PointerState) => {
    console.log('pointer down')
  }

  public update = (pointer: PointerState) => {
    if (!this.state.key('focus').get()) {
      return
    }
    console.log('pointer move')
  }

  public finish = (pointer: PointerState) => {
    console.log('pointer up')
  }

  public blur = () => {
    this.state.set({ focus: false })
  }

  public focus = () => {
    this.state.set({ focus: true })
  }

  public wheel: Canvas['wheel'] = (point, delta) => {
    this.canvas.wheel(point, delta)
  }
  public reset = () => this.state.set(defaultActionsState)
}
