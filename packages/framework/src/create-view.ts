import {
  getCanvasStyle,
  createInteractionHandler,
  InfinityKit,
  defaultToolset,
  Toolbox
} from '@figureland/infinitykit'
import {
  type Entity,
  type MicrocosmAPI,
  fromPartialEntity,
  isEditableAPI,
  type EntityCreatePayload,
  type EntityType,
  isEntity,
  isEntityLocation
} from '@nodenogg.in/microcosm'
import { system, signal, type PersistenceName } from '@figureland/statekit'
import type { App } from './create-app'
import { importFiles } from '@nodenogg.in/io/import'
import { randomInt } from '@figureland/mathkit/random'
import { isContentType, type FileDropContent } from '@figureland/toolkit/filedrop'
import { boxCenter } from '@figureland/mathkit/box'
import { size } from '@figureland/mathkit/size'
import { vector2 } from '@figureland/mathkit/vector2'
import { dp } from '@figureland/mathkit/number'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const createView = <M extends MicrocosmAPI>(
  api: M,
  app: App<M>,
  persistenceName: PersistenceName
) => {
  try {
    const { use, dispose } = system()

    const infinitykit = use(
      new InfinityKit(api.query, {
        tools: defaultToolset(),
        initialTool: 'select',
        persistence: [...persistenceName, 'canvas']
      })
    )

    const interaction = use(createInteractionHandler(app.pointer, infinitykit))

    const onDropFiles = async (content: FileDropContent) => {
      if (isEditableAPI(api)) {
        let parsed: EntityCreatePayload[] = []

        const center = infinitykit.canvas.getCanvasCenter()

        if (isContentType(content, 'text')) {
          parsed.push(
            fromPartialEntity({
              type: 'html',
              body: content.data
            })
          )
        } else {
          const converted = await importFiles(content.data)
          for (const c of converted) {
            parsed.push(fromPartialEntity(c))
          }
        }

        const stack: Entity[] = []
        for (const n of parsed) {
          const dimensions = size(randomInt(100, 400), randomInt(100, 400))
          const position = vector2(
            dp(center.x - dimensions.width / 2),
            dp(center.y - dimensions.height / 2)
          )

          const r = await api.create({
            ...n,
            ...dimensions,
            x: position.x,
            y: position.y
          })
          stack.push(r)
        }
      }
    }

    const isActive = () => app.microcosms.active.get() === api.microcosmID

    use(app.filedrop.events.on('drop', onDropFiles))
    // use(app.pointer.key('point').on(() => canvas.update(app.pointer.get())))
    use(
      app.keycommands.on({
        all: () => {
          if (isActive()) {
            infinitykit.selectAll()
          }
        },
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
        //     [drawEntityTool.command]: () => {
        //       if (isActive()) {
        //         canvas.setTool('drawEntity')
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
        backspace: async () => {
          if (isActive() && isEditableAPI(api)) {
            const selected = infinitykit.state.get().selection.filter(isEntityLocation)
            await api.delete(selected)
          }
        },
        //     space: () => {
        //       if (isActive()) {
        //         canvas.setTool('move')
        //       }
        //     },
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
      })
    )

    const cssVariables = use(signal((get) => getCanvasStyle(get(infinitykit.canvas.transform))))

    return {
      infinitykit,
      cssVariables,
      interaction,
      dispose
    }
  } catch (error) {
    throw app.telemetry.catch(error)
  }
}

export type View = ReturnType<typeof createView>
