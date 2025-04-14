import {
  InfinityKit,
  Canvas,
  createInteractionAdapter,
  createDefaultToolset
} from '@figureland/kit/infinity'
import {
  type Entity,
  type MicrocosmAPI,
  type CreateEntityPayload,
  fromPartialEntity,
  isEditableAPI,
  isEntityLocation
} from '@nodenogg.in/microcosm'
import { importFiles } from '@nodenogg.in/app/io/import'
import { manager, persist } from '@figureland/kit/state'
import { isContentType, type FileDropContent } from '@figureland/kit/browser/filedrop'
import { size } from '@figureland/kit/math/size'
import { vector2 } from '@figureland/kit/math/vector2'
import { dp } from '@figureland/kit/math/number'
import { storage } from '@figureland/kit/state/local-storage'
import { isMatrix2D } from '@figureland/kit/math/matrix2D'
import type { App } from './create-app'
import { MicrocosmAgent } from '.'

export type CanvasToolset = ReturnType<typeof createDefaultToolset>

export const createView = <M extends MicrocosmAPI>(
  agent: MicrocosmAgent<M>,
  api: M,
  app: App,
  persistenceName: string
) => {
  try {
    const { use, dispose } = manager()

    const canvas = use(new Canvas())

    const infinitykit = use(
      new InfinityKit(canvas, api.query, {
        tools: createDefaultToolset(),
        initialTool: 'select'
      })
    )

    persist(
      canvas.transform,
      storage({
        name: `${persistenceName}/canvas`,
        validate: isMatrix2D,
        interval: 1000,
        fallback: canvas.transform.get
      })
    )

    const interaction = use(createInteractionAdapter(app.pointer, infinitykit))

    const onDropFiles = async (content: FileDropContent) => {
      if (isEditableAPI(api)) {
        const parsed: CreateEntityPayload[] = []

        const center = infinitykit.canvas.getCenter()

        if (isContentType(content, 'text')) {
          parsed.push(
            fromPartialEntity({
              type: 'html',
              body: content.data
            })
          )
        } else {
          for (const c of await importFiles(content.data)) {
            parsed.push(fromPartialEntity(c))
          }
        }

        const stack: Entity[] = []
        for (const n of parsed) {
          const dimensions = size(400, 300)
          const position = vector2(
            dp(center.canvas.x - dimensions.width / 2),
            dp(center.canvas.y - dimensions.height / 2)
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

    const isActive = () => agent.active.get() === api.microcosmID

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
