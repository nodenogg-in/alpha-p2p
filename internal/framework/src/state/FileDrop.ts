import { State, createEvents } from '@nodenogg.in/statekit'
import { isNotNullish } from '@nodenogg.in/toolkit'

export type FileDropEvents = {
  drop: File[]
  enter: File[]
  over: File[]
  leave: true
}

export class FileDrop extends State<{ active: boolean; count: number }> {
  events = createEvents<FileDropEvents>()
  constructor(
    private readonly mimeTypes: string[],
    private readonly maxSize = 1024 * 64
  ) {
    super({
      initial: () => ({ active: false, count: 0 })
    })

    window.addEventListener('dragenter', this.onDragEnter)
    window.addEventListener('dragleave', this.onDragLeave)
    window.addEventListener('dragover', this.onDragOver)
    window.addEventListener('drop', this.onDrop)

    this.use(() => {
      window.removeEventListener('dragenter', this.onDragEnter)
      window.removeEventListener('dragleave', this.onDragLeave)
      window.removeEventListener('dragover', this.onDragOver)
      window.removeEventListener('drop', this.onDrop)
    })
  }

  private onDragEnter = (event: DragEvent) =>
    this.filterEvent(event, (count) => {
      this.set({
        active: true,
        count
      })
    })

  private onDragLeave = (event: DragEvent) => this.filterEvent(event, this.resetInitial)

  private onDragOver = (event: DragEvent) =>
    this.filterEvent(event, (count) => {
      this.set({
        active: true,
        count
      })
    })

  private onDrop = (event: DragEvent) =>
    this.filterEvent(event, () => {
      this.resetInitial()
      const files = this.getFiles(event)
      if (files) {
        this.events.emit('drop', files)
      }
    })

  private filterEvent = (event: DragEvent, fn: (count: number) => void) => {
    event.preventDefault()

    const items = Array.from(event?.dataTransfer?.items || [])
    const types = items.map((i) => (i.kind === 'file' ? i.type : null)).filter(isNotNullish)

    if (
      !event.dataTransfer ||
      !this.mimeTypes.some((item) => types.includes(item)) ||
      items.length === 0
    ) {
      fn(0)
    } else {
      fn(items.length)
    }
  }

  private getFiles = (event: DragEvent) => {
    const files = Array.from(event.dataTransfer?.files || [])

    if (files.length === 0) {
      return
    }

    if (files.some((file) => file.size > this.maxSize)) {
      return
    }

    return files
  }
}
