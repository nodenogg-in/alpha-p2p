import { Events, SignalObject, createEvents, signalObject } from '@figureland/statekit'
import { isNotNullish } from '@figureland/typekit/guards'
import { createListener, type ListenerTarget } from '../utils/dom-events'

export type FileDropEvents = {
  drop: File[]
  enter: File[]
  over: File[]
  leave: true
}

const initialState = {
  active: false,
  count: 0
}

export type FileDropOptions = {
  target?: ListenerTarget
  mimeTypes: string[]
  maxSize?: number
}

export type FileDropState = {
  active: boolean
  count: number
}

export const createFileDrop = ({
  target = window,
  mimeTypes,
  maxSize = 1024 * 64
}: FileDropOptions) => {
  const state = signalObject<FileDropState>(initialState)
  const events = createEvents<FileDropEvents>()

  const reset = () => state.set(initialState)

  const onDragEnter = (event: DragEvent) =>
    filterEvent(event, (count) => {
      state.set({
        active: true,
        count
      })
    })

  const onDragLeave = (event: DragEvent) => filterEvent(event, reset)

  const onDragOver = (event: DragEvent) =>
    filterEvent(event, (count) => {
      state.set({
        active: true,
        count
      })
    })

  const onDrop = (event: DragEvent) =>
    filterEvent(event, () => {
      reset()
      const files = getFiles(event)
      if (files) {
        events.emit('drop', files)
      }
    })

  const filterEvent = (event: DragEvent, fn: (count: number) => void) => {
    event.preventDefault()

    const items = Array.from(event?.dataTransfer?.items || [])
    const types = items.map((i) => (i.kind === 'file' ? i.type : null)).filter(isNotNullish)

    if (
      !event.dataTransfer ||
      !mimeTypes.some((item) => types.includes(item)) ||
      items.length === 0
    ) {
      fn(0)
    } else {
      fn(items.length)
    }
  }

  const getFiles = (event: DragEvent) => {
    const files = Array.from(event.dataTransfer?.files || [])

    if (files.length === 0) {
      return
    }

    if (files.some((file) => file.size > maxSize)) {
      return
    }

    return files
  }

  state.use(events)
  state.use(createListener(target, 'dragenter', onDragEnter))
  state.use(createListener(target, 'dragleave', onDragLeave))
  state.use(createListener(target, 'dragover', onDragOver))
  state.use(createListener(target, 'drop', onDrop))

  return {
    state,
    events
  }
}

export type FileDrop = {
  state: SignalObject<FileDropState>
  events: Events<FileDropEvents>
}
