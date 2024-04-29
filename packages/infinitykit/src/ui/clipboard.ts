import {
  type Signal,
  type Disposable,
  type Events,
  manager,
  signal,
  createEvents
} from '@figureland/statekit'
import { createListener } from '../utils/dom-events'
import {
  type ClipboardEntry,
  type ParsedClipboardItem,
  parseClipboardItem,
  createClipboardItems
} from '../utils/blob'
import { promiseSome } from '@figureland/typekit/promise'

export const supportsClipboard = (): boolean => 'navigator' && 'clipboard' in navigator

export type ParsedClipboardEvent = ParsedClipboardData & { event: ClipboardEvent }

export type ClipboardEvents = {
  copy: ParsedClipboardEvent
  cut: ParsedClipboardEvent
  paste: ParsedClipboardEvent
}

const getClipboardData = async () => {
  const items = await navigator.clipboard.read()
  const result = await promiseSome(items.map(parseClipboardItem))
  return {
    items: result.fulfilled,
    text: await navigator.clipboard.readText()
  }
}

export type ParsedClipboardData = {
  items: ParsedClipboardItem[]
  text: string
}

export const createClipboard = (): Clipboard => {
  const { use, dispose } = manager()
  const available = use(signal(supportsClipboard))

  const events = createEvents<ClipboardEvents>()

  const emit = async (type: keyof ClipboardEvents, event: ClipboardEvent) => {
    const data = await getClipboardData()

    if (data.items.length > 0) {
      events.emit(type, { ...data, event })
    }
  }

  const handleCopy = (e: ClipboardEvent) => emit('copy', e)
  const handleCut = (e: ClipboardEvent) => emit('cut', e)
  const handlePaste = (e: ClipboardEvent) => emit('paste', e)

  const copy = async (values: ClipboardEntry[] = []) => {
    if (available.get()) {
      const data = await createClipboardItems(values)
      await navigator!.clipboard.write(data)
    }
  }

  const read = async () => {
    if (available.get()) {
      return await getClipboardData()
    }
  }

  use(createListener(window, 'copy', handleCopy))
  use(createListener(window, 'cut', handleCut))
  use(createListener(window, 'paste', handlePaste))

  return {
    events,
    copy,
    read,
    available,
    dispose
  }
}

export type Clipboard = Disposable & {
  events: Events<ClipboardEvents>
  copy: (items: ClipboardEntry[]) => Promise<void>
  available: Signal<boolean>
  read: () => Promise<ParsedClipboardData | undefined>
}
