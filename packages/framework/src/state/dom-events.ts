export type ListenerTarget = Document | Window | HTMLElement

export const createListener = (
  target: ListenerTarget = document,
  eventName: string,
  fn: (e: Event) => void
) => {
  target.addEventListener(eventName, fn)
  return () => target.removeEventListener(eventName, fn)
}
