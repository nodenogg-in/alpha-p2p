import {
  SpaceKit,
  DEFAULT_BOX_SIZE,
  generateBoxPositions,
  defaultTools
} from '@nodenogg.in/spacekit'
import { isEditableAPI, type MicrocosmAPI } from '@nodenogg.in/microcosm'
import { type ViewFactoryOptions } from '../..'
import { Importer, type ParsedNode, isParsedNodeType } from '../../parsers'

export const spatial = async <M extends MicrocosmAPI>({
  ui,
  session,
  api,
  config: { id, persist }
}: ViewFactoryOptions<M>) => {
  const { onPointerDown, onPointerUp, ...canvas } = new SpaceKit(api, {
    tools: defaultTools,
    canvas: {
      persist
    }
  })

  const isActive = () => session.isActive(api.microcosm_uri)

  canvas.action.events.on('create', (boxes) => {
    console.log(boxes)
  })

  api.use(
    session.user.on(() => {
      if (isEditableAPI(api)) {
        api.join()
      }
    }),
    ui.keyboard.events.onMany({
      redo: () => {
        if (isActive() && isEditableAPI(api)) {
          api.redo()
        }
      },
      undo: () => {
        if (isActive() && isEditableAPI(api)) {
          api.undo()
        }
      }
    })
  )

  if (isEditableAPI(api)) {
    api.use(
      api.key('status').on(({ connected }) => {
        if (connected) api.join()
      }),
      session.key('active').on(() => {})
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
      }
    })
  )

  return {
    type: 'spatial',
    id,
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
