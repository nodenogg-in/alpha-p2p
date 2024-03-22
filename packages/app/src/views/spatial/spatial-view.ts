import { SpatialKit, DEFAULT_BOX_SIZE, generateBoxPositions } from '@nodenogg.in/spatialkit'
import { isEditableAPI, type MicrocosmAPI } from '@nodenogg.in/microcosm'
import { Instance, type ViewConfig } from '../..'
import { Importer, type ParsedNode, isParsedNodeType } from '../../parsers'

export const spatial = async <M extends MicrocosmAPI>(api: M, { id, persist }: ViewConfig) => {
  const { onPointerDown, onPointerUp, ...canvas } = new SpatialKit<any>(api, {
    tools: ['select', 'move', 'new', 'connect'],
    persist
  })

  canvas.interaction.key('background').set('lines')

  const {
    ui: { screen, keyboard, filedrop },
    session
  } = Instance

  api.use(
    session.user.on(() => {
      if (isEditableAPI(api)) {
        api.join()
      }
    }),
    keyboard.onCommand({
      redo: () => {
        console.log('want to redo')
        if (api.isActive() && isEditableAPI(api)) {
          console.log('attempting redo')
          api.redo()
          console.log('done redo')
        }
      },
      undo: () => {
        console.log('want to undo')
        if (api.isActive() && isEditableAPI(api)) {
          console.log('attempting undo')
          api.undo()
          console.log('done undo')
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

  const onDropFiles = async ([files]: [File[]]) => {
    if (isEditableAPI(api) && canvas.isActive()) {
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
    screen.key('pointer').on(canvas.update),
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
