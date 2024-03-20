import { Canvas, DEFAULT_BOX_SIZE, generateBoxPositions } from '@nodenogg.in/spatialkit'
import type { ViewConfig } from './api'
import type { MicrocosmAPI } from '../api/MicrocosmAPI'
import { Instance } from '../app/Instance'
import { Importer, type ParsedNode, isParsedNodeType } from '@nodenogg.in/parsers'
import { isEditable } from '../api/api'


export const spatial = async <M extends MicrocosmAPI>(api: M, { id, persist }: ViewConfig): Promise<any> => {
  const { onPointerDown, onPointerUp, ...canvas } = new Canvas<M>(api, {
    tools: ['select', 'move', 'new', 'connect'],
    persist,
    bounds: { x: 1000, y: 1000 },
    background: 'lines'
  })

  canvas.interaction.key('background').set('dots')

  const { screen, keyboard, filedrop } = Instance.ui

  const onDropFiles = async ([files]: [File[]]) => {
    if (isEditable(api) && canvas.isActive()) {
      const converted = await new Importer().importFiles(files)
      const htmlNodes = converted.filter((n) => isParsedNodeType(n, 'html')) as ParsedNode<'html'>[]

      const origin = canvas.interaction.getViewCenter()
      const positions = generateBoxPositions(origin, DEFAULT_BOX_SIZE, htmlNodes)

      const nodes = htmlNodes.map((node, i) => ({
        ...node,
        ...positions[i]
      }))
      api.create(nodes)
    }
  }

  canvas.use(
    filedrop.events.subscribe('drop', onDropFiles),
    screen.key('pointer').on((pointer) => canvas.update(pointer)),
    keyboard.onCommand({
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

  return {
    type: 'spatial',
    id,
    ...canvas,
    onPointerDown: (e: PointerEvent) => {
      onPointerDown(screen.key('pointer').get(), e)
    },
    onPointerUp: () => {
      onPointerUp(screen.key('pointer').get())
    }
  }
}

export type SpatialView = ReturnType<typeof spatial>
