import {
  InfinityKit,
  DEFAULT_BOX_SIZE,
  generateBoxPositions,
  defaultTools,
  getCanvasStyles,
  drawRegionTool,
  drawNodeTool,
  selectTool,
  moveTool,
  connectTool
} from '@figureland/infinitykit'
import { isEditableAPI, isNodeType, type MicrocosmAPI } from '@nodenogg.in/microcosm'
import { Importer, type ParsedNode } from '@nodenogg.in/io/import'
import { manager, persist, signal } from '@figureland/statekit'
import { isMatrix2D } from '@figureland/mathkit/matrix2D'
import { type PersistenceName, typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import type { App } from './create-app'

export const createView = <M extends MicrocosmAPI>(
  api: M,
  app: App<M>,
  persistenceName: PersistenceName
) => {
  try {
    const { use, dispose } = manager()

    const { onPointerDown, onPointerUp, ...canvas } = new InfinityKit(api as any, {
      tools: defaultTools
    })

    use(canvas)

    console.log(canvas)
    persist(
      canvas.interaction.transform,
      typedLocalStorage({
        name: [...persistenceName, 'transform'],
        validate: isMatrix2D,
        fallback: canvas.interaction.transform.get,
        interval: 1000
      })
    )

    canvas.interaction.state.key('background').set('dots')

    const isActive = () => app.session.isActive(api.microcosmID)

    // if (isEditableAPI(api)) {
    //   use(
    //     api.key('status').on(({ connected }) => {
    //       if (connected) api.join()
    //     })
    //   )
    // }

    const onDropFiles = async (files: File[]) => {
      if (isEditableAPI(api) && isActive()) {
        const converted = await new Importer().importFiles(files)
        const htmlNodes = converted.filter((n) => isNodeType(n, 'html')) as ParsedNode<'html'>[]

        const origin = canvas.interaction.transform.screenToCanvas(
          canvas.interaction.getViewCenter()
        )
        const positions = generateBoxPositions(origin, DEFAULT_BOX_SIZE, htmlNodes)

        const nodes = htmlNodes.map((node, i) => ({
          ...node,
          ...positions[i]
        }))
        console.log(nodes)
        // api.create(nodes)
      }
    }

    use(
      app.session.active.on(() => {
        console.log('active')
      })
    )
    use(
      canvas.action.events.on('create', (boxes) => {
        console.log(boxes)
      })
    )

    use(
      app.identity.on(() => {
        if (isEditableAPI(api)) {
          api.join()
        }
      })
    )
    use(app.filedrop.events.on('drop', onDropFiles))
    use(app.pointer.on(canvas.update))
    use(
      app.keycommands.onMany({
        all: () => {
          if (isActive()) {
            canvas.select()
          }
        },
        [moveTool.command]: () => {
          if (isActive()) {
            canvas.setTool('move')
          }
        },
        [selectTool.command]: () => {
          if (isActive()) {
            canvas.setTool('select')
          }
        },
        [drawNodeTool.command]: () => {
          if (isActive()) {
            canvas.setTool('drawNode')
          }
        },
        [drawRegionTool.command]: () => {
          if (isActive()) {
            canvas.setTool('drawRegion')
          }
        },
        [connectTool.command]: () => {
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

    const canvasStyles = use(
      signal((get) =>
        getCanvasStyles(get(canvas.interaction.transform), get(canvas.interaction.state))
      )
    )

    const zoom = (v: number) => {
      console.log(v)
    }

    return {
      type: 'spatial',
      ...canvas,
      canvasStyles,
      zoom,
      onPointerDown: (e: PointerEvent) => {
        onPointerDown(app.pointer.get(), e)
      },
      onPointerUp: () => {
        onPointerUp(app.pointer.get())
      },
      dispose
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export type View = ReturnType<typeof createView>
