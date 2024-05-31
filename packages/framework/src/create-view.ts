import {
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
import { randomInt } from '@figureland/mathkit/random'
import { Box, box, intersects } from '@figureland/mathkit/box'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

    const visible = use(
      api.query.signalQuery(
        Symbol(),
        signal((get) => {
          get(actions.canvas.transform)
          const viewport = get(actions.canvas.viewport)
          return actions.canvas.screenToCanvas(viewport, viewport)
        })
      )
    )
    visible.on(console.log)
    // const objects = new CanvasQuery<EntityLocation, BoxLikeEntity>()

    // delay(1000).then(() => {
    //   api.getEntities().forEach(async (entity) => {
    //     const target = api.getEntity(entity)
    //     if (isBoxLikeEntity(target)) {
    //       objects.add(entity, target)
    //     }
    //   })
    // })

    // delay(3000).then(async () => {
    //   // const r = await objects.query('visible')
    //   // console.log(r)

    //   const s = await api.query.search('query/something', { target: box(-734, -686, 2, 2) })
    //   console.log(s)

    //   const bb = objects.boundingBox(s)
    //   console.log(bb)
    // })

    // const matching = signal((get) => {
    //   get(actions.canvas.transform)
    //   const viewport = get(actions.canvas.viewport)
    //   const vp = actions.canvas.screenToCanvas(viewport, viewport)
    //   // console.log(vp)
    //   const r = new Rectangle('@test/e_0sdf', vp)
    //   tree.update(r)
    //   const ids = tree.retrieve(r).map((r) => r.id)
    //   console.log(ids.length)
    //   return ids
    // })

    // matching.on((ids) => {
    //   console.log(ids)
    // })

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

        // console.log(parsed)
        for (const n of parsed) {
          const r = api.create({
            ...n,
            width: randomInt(100, 400),
            height: randomInt(100, 400),
            x: randomInt(-1200, 1200),
            y: randomInt(-1200, 1200)
          })
          stack.push(r)
        }

        // for (const e of stack) {
        //   if (isBoxLikeEntity(e)) {
        //     const t = await objects.query('test', vector2(e.x, e.y))
        //     console.log(!!t.items.find((te) => te.id === e.id))
        //     const t2 = await objects.query('test', vector2(e.x - 50, e.y - 50))
        //     console.log(!!t2.items.find((te) => te.id === e.id))
        //   }
        // }

        // await delay(2500)

        // for (const { id } of stack) {
        //   api.update(id, { body: 'sausages' })
        // }

        // await delay(5000)
        // for (const { id } of stack) {
        //   api.delete(id)
        // }

        // console.log(stack)
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
      visible,
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
