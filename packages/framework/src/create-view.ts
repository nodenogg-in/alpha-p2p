import { createInteractionAdapter, InfinityKit, defaultToolset } from '@figureland/infinitykit'
import {
  type Entity,
  type MicrocosmAPI,
  type EntityCreatePayload,
  fromPartialEntity,
  isEditableAPI,
  isEntityLocation
} from '@nodenogg.in/microcosm'
import { importFiles } from '@nodenogg.in/io/import'
import { system, signal, persist, type PersistenceName } from '@figureland/statekit'
import { isContentType, type FileDropContent } from '@figureland/toolkit/filedrop'
import { size } from '@figureland/mathkit/size'
import { vector2 } from '@figureland/mathkit/vector2'
import { dp } from '@figureland/mathkit/number'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { isMatrix2D } from '@figureland/mathkit/matrix2D'
import type { App } from './create-app'

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
        initialTool: 'move'
      })
    )

    persist(
      infinitykit.canvas.transform,
      typedLocalStorage({
        name: [...persistenceName, 'canvas'],
        validate: isMatrix2D,
        interval: 1000,
        fallback: infinitykit.canvas.transform.get
      })
    )

    const interaction = use(createInteractionAdapter(app.pointer, infinitykit))

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
          const dimensions = size(400, 300)
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

    return {
      infinitykit,
      interaction,
      dispose
    }
  } catch (error) {
    throw app.telemetry.catch(error)
  }
}

export type View = ReturnType<typeof createView>
