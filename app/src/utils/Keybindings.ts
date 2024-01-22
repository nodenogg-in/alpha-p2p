import { tinykeys } from './libs/tinykeys'

type Unsubscribe = () => void

export const createKeybindings = (
  events: Record<string, (e: KeyboardEvent) => void>
): Unsubscribe => tinykeys(window, events)
