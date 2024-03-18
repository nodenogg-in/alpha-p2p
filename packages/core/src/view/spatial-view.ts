import type { View, ViewConfig } from './api'
import type { MicrocosmAPI } from '../api/MicrocosmAPI'
import { Canvas } from '@nodenogg.in/spatial-view'
import { Instance } from '../app/Instance'

export const spatial = <M extends MicrocosmAPI>({ api, id, persist }: ViewConfig<M>) => {
  const canvas = new Canvas<M>(api, id, persist)
  canvas.onDispose(
    Instance.ui.screen.key('pointer').on((pointer) => canvas.update(pointer)),
    Instance.ui.keyboard.onCommand({
      all: () => {
        if (canvas.isActive()) {
          canvas.select()
        }
      },
      h: () => {
        if (canvas.isActive()) {
          canvas.setTool('move')
        }
      },
      v: () => {
        if (canvas.isActive()) {
          canvas.setTool('select')
        }
      },
      n: () => {
        if (canvas.isActive()) {
          canvas.setTool('new')
        }
      },
      c: () => {
        if (canvas.isActive()) {
          canvas.setTool('connect')
        }
      },
      backspace: () => {
        if (canvas.isActive()) {
          console.log('backspace')
        }
      },
      space: () => {
        if (canvas.isActive()) {
          canvas.setTool('move')
        }
      }
    })
  )

  const onPointerDown = (e: PointerEvent) => {
    canvas.onPointerDown(Instance.ui.screen.key('pointer').get(), e)
  }
  const onPointerUp = () => canvas.onPointerUp(Instance.ui.screen.key('pointer').get())
  const onPointerOut = () => canvas.onPointerOut()
  const onPointerOver = () => canvas.onPointerOver()

  const { interaction, action, onWheel, onFocus, setTool, toolbar, onDropFiles, dispose, styles } =
    canvas
  const { resize, zoom } = canvas.interaction

  return {
    id,
    interaction,
    action,
    onWheel,
    onFocus,
    setTool,
    toolbar,
    onDropFiles,
    dispose,
    onPointerDown,
    onPointerUp,
    onPointerOut,
    onPointerOver,
    resize,
    zoom,
    styles
  }
}
