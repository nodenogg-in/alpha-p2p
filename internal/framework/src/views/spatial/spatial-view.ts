import {
  InfinityKit,
  DEFAULT_BOX_SIZE,
  generateBoxPositions,
  defaultTools
} from '@nodenogg.in/infinitykit'
import { isEditableAPI, type MicrocosmAPI } from '@nodenogg.in/microcosm'
import { Importer, type ParsedNode, isParsedNodeType } from '@nodenogg.in/io'
import { type ViewFactoryOptions } from '../..'

export const spatial = async <M extends MicrocosmAPI>({
  ui,
  session,
  api,
  config: { id, persist }
}: ViewFactoryOptions<M>) => {
  const { onPointerDown, onPointerUp, ...canvas } = new InfinityKit(api as any, {
    tools: defaultTools,
    canvas: {
      persist
    }
  })

  const isActive = () => session.isActive(api.microcosmID)

  if (isEditableAPI(api)) {
    api.use(
      api.key('status').on(({ connected }) => {
        if (connected) api.join()
      })
    )
  }

  const onDropFiles = async (files: File[]) => {
    if (isEditableAPI(api) && isActive()) {
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
    session.key('active').on(() => {
      console.log('active')
    }),
    canvas.action.events.on('create', (boxes) => {
      console.log(boxes)
    }),
    session.user.on(() => {
      if (isEditableAPI(api)) {
        api.join()
      }
    }),
    ui.filedrop.events.on('drop', onDropFiles),
    ui.screen.key('pointer').on(canvas.update),
    ui.keyboard.events.onMany({
      all: () => {
        if (isActive()) {
          canvas.select()
        }
      },
      h: () => {
        if (isActive()) {
          canvas.setTool('move')
        }
      },
      v: () => {
        if (isActive()) {
          canvas.setTool('select')
        }
      },
      n: () => {
        if (isActive()) {
          canvas.setTool('new')
        }
      },
      c: () => {
        if (isActive()) {
          canvas.setTool('connect')
        }
      },
      backspace: () => {
        if (isActive()) {
          console.log('backspace')
        }
      },
      space: () => {
        if (isActive()) {
          canvas.setTool('move')
        }
      },
      redo: () => {
        if (isActive() && isEditableAPI(api)) {
          api.redo()
        }
      },
      undo: () => {
        if (isActive() && isEditableAPI(api)) {
          api.undo()
        }
      },
      zoomReset: () => {
        if (isActive()) {
          canvas.interaction.zoom(1.0)
        }
      },
      zoomIn: () => {
        if (isActive()) {
          canvas.interaction.zoomIn()
        }
      },
      zoomOut: () => {
        if (isActive()) {
          canvas.interaction.zoomOut()
        }
      }
    })
  )

  return {
    type: 'spatial',
    ...canvas,
    onPointerDown: (e: PointerEvent) => {
      onPointerDown(ui.screen.key('pointer').get(), e)
    },
    onPointerUp: () => {
      onPointerUp(ui.screen.key('pointer').get())
    }
  }
}

export type SpatialView = ReturnType<typeof spatial>
