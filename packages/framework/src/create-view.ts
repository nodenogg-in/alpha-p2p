import {
  Canvas,
  Actions,
  defaultTools,
  getCanvasStyle,
  createInteractionHandler
} from '@figureland/infinitykit'
import {
  type Entity,
  type MicrocosmAPI,
  fromPartialEntity,
  isEditableAPI
} from '@nodenogg.in/microcosm'
import { system, signal } from '@figureland/statekit'
import type { PersistenceName } from '@figureland/statekit'
import type { App } from './create-app'
import { importFiles } from '@nodenogg.in/io/import'

export const createView = <M extends MicrocosmAPI>(
  api: M,
  app: App<M>,
  persistenceName: PersistenceName
) => {
  try {
    const { use, dispose } = system()

    const actions = new Actions({
      tools: defaultTools,
      persistence: [...persistenceName, 'transform']
    })

    const interaction = createInteractionHandler(app.pointer, actions)

    const isActive = () => app.microcosms.isActive(api.config.microcosmID)

    use(actions)
    use(interaction)

    actions.setTool('drawRegion')
    // if (isEditableAPI(api)) {
    //   use(
    //     api.key('status').on(({ connected }) => {
    //       if (connected) api.join()
    //     })
    //   )
    // }

    const onDropFiles = async (files: File[]) => {
      if (isEditableAPI(api)) {
        const converted = await importFiles(files)
        const parsed = converted.map(fromPartialEntity)

        //   const origin = canvas.interaction.screenToCanvas(canvas.interaction.getViewCenter())
        //   const positions = generateBoxPositions(origin, DEFAULT_BOX_SIZE, htmlNodes)

        //   const nodes = htmlNodes.map((node, i) => ({
        //     ...node,
        //     ...positions[i]
        //   }))

        const stack: Entity[] = []

        console.log(parsed)
        for (const n of parsed) {
          const r = api.create(n)
          stack.push(r)
        }
        console.log(stack)
      }
      // }
    }

    // // use(
    // //   app.identity.on(() => {
    // //     if (isEditableAPI(api)) {
    // //       api.join()
    // //     }
    // //   })
    // // )
    use(app.filedrop.events.on('drop', onDropFiles))
    // use(app.pointer.key('point').on(() => canvas.update(app.pointer.get())))
    // use(
    //   app.keycommands.onMany({
    //     all: () => {
    //       if (isActive()) {
    //         canvas.select()
    //       }
    //     },
    //     [moveTool.command]: () => {
    //       if (isActive()) {
    //         canvas.setTool('move')
    //       }
    //     },
    //     [selectTool.command]: () => {
    //       if (isActive()) {
    //         canvas.setTool('select')
    //       }
    //     },
    //     [drawNodeTool.command]: () => {
    //       if (isActive()) {
    //         canvas.setTool('drawNode')
    //       }
    //     },
    //     [drawRegionTool.command]: () => {
    //       if (isActive()) {
    //         canvas.setTool('drawRegion')
    //       }
    //     },
    //     [connectTool.command]: () => {
    //       if (isActive()) {
    //         canvas.setTool('connect')
    //       }
    //     },
    //     backspace: () => {
    //       if (isActive()) {
    //         console.log('backspace')
    //       }
    //     },
    //     space: () => {
    //       if (isActive()) {
    //         canvas.setTool('move')
    //       }
    //     },
    //     redo: () => {
    //       if (isActive() && isEditableAPI(api)) {
    //         api.redo()
    //       }
    //     },
    //     undo: () => {
    //       if (isActive() && isEditableAPI(api)) {
    //         api.undo()
    //       }
    //     },
    //     zoomReset: () => {
    //       if (isActive()) {
    //         canvas.interaction.zoom(1.0)
    //       }
    //     },
    //     zoomIn: () => {
    //       if (isActive()) {
    //         canvas.interaction.zoomIn()
    //       }
    //     },
    //     zoomOut: () => {
    //       if (isActive()) {
    //         canvas.interaction.zoomOut()
    //       }
    //     }
    //   })
    // )

    const cssVariables = use(signal((get) => getCanvasStyle(get(actions.canvas.transform))))

    // return {
    //   type: 'spatial',
    //   options,
    //   ...canvas,
    //   canvasStyles,
    //   onPointerDown: (e: PointerEvent) => {
    //     onPointerDown(app.pointer.get(), e)
    //   },
    //   onPointerUp: () => {
    //     onPointerUp(app.pointer.get())
    //   },
    //   dispose
    // }
    return {
      cssVariables,
      actions,
      interaction,
      dispose
    }
  } catch (error) {
    throw app.telemetry.catch(error)
  }
}

export type View = ReturnType<typeof createView>
