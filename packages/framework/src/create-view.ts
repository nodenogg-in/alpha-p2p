import { Canvas, Actions, Interaction, defaultTools, getCanvasStyle } from '@figureland/infinitykit'
import { type MicrocosmAPI } from '@nodenogg.in/microcosm'
import { system, persist, signal, signalObject } from '@figureland/statekit'
import { isMatrix2D } from '@figureland/mathkit/matrix2D'
import { type PersistenceName, typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import type { App } from './create-app'
import { isObject, isString } from '@figureland/typekit'
import { Importer } from '@nodenogg.in/io/import'

export const createView = <M extends MicrocosmAPI>(
  api: M,
  app: App<M>,
  persistenceName: PersistenceName
) => {
  try {
    const { use, dispose } = system()

    const options = use(
      signalObject({
        background: 'lines'
      })
    )

    persist(
      options,
      typedLocalStorage({
        name: [...persistenceName, 'options'],
        validate: (v) => isObject(v) && 'background' in v && isString(v.background),
        fallback: options.get
      })
    )

    const canvas = use(new Canvas())
    const actions = use(new Actions(defaultTools, canvas))
    const interaction = use(new Interaction(actions, canvas, app.pointer))

    persist(
      canvas.transform,
      typedLocalStorage({
        name: [...persistenceName, 'transform'],
        validate: isMatrix2D,
        fallback: canvas.transform.get,
        interval: 1000
      })
    )

    const isActive = () => app.microcosms.isActive(api.config.microcosmID)

    // if (isEditableAPI(api)) {
    //   use(
    //     api.key('status').on(({ connected }) => {
    //       if (connected) api.join()
    //     })
    //   )
    // }

    const onDropFiles = async (files: File[]) => {
      console.log(files)
      // if (isEditableAPI(api) && isActive()) {
      //   const converted = await Importer.importFiles(files)
      //   const parsed = converted.map(fromPartial)
      //   const htmlNodes = converted.filter((n) => isNodeType(n, 'html')) as ParsedNode<'html'>[]

      //   const origin = canvas.interaction.screenToCanvas(canvas.interaction.getViewCenter())
      //   const positions = generateBoxPositions(origin, DEFAULT_BOX_SIZE, htmlNodes)

      //   const nodes = htmlNodes.map((node, i) => ({
      //     ...node,
      //     ...positions[i]
      //   }))

      //   for (const n of parsed) {
      //     api.create(n)
      //   }
      // }
    }

    // use(
    //   app.session.active.on(() => {
    //     console.log('active')
    //   })
    // )
    // use(
    //   canvas.action.events.on('create', (boxes) => {
    //     console.log(boxes)
    //   })
    // )

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

    const cssVariables = use(signal((get) => getCanvasStyle(get(canvas.transform))))

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
      options,
      cssVariables,
      canvas,
      actions,
      interaction,
      dispose
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export type View = ReturnType<typeof createView>
