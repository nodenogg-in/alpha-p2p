import { deepAssign, type Emitter } from 'nodenoggin'
import { customRef, onBeforeUnmount, reactive } from 'vue'

export const useEmitterReactive = <
  T extends Record<string, any>,
  TEventName extends keyof T & string
>(
  emitter: Emitter<T>,
  event: TEventName,
  defaultValue: () => T[TEventName],
  onChange?: (value: T[TEventName]) => void
) => {
  const value = reactive<T[TEventName]>(defaultValue())
  const handler = (data: T[TEventName]) => {
    deepAssign(value, data)
    if (onChange) {
      onChange(data)
    }
  }
  emitter.on(event, handler)
  onBeforeUnmount(() => {
    emitter.off(event, handler)
  })
  return value
}

export const useEmitterRef = <T extends Record<string, any>, TEventName extends keyof T & string>(
  emitter: Emitter<T>,
  event: TEventName,
  defaultValue: T[TEventName],
  onChange?: (value: T[TEventName]) => void
) => {
  return customRef<T[TEventName]>((track, trigger) => {
    let value = defaultValue
    const handler = (data: T[TEventName]) => {
      value = data
      if (onChange) {
        onChange(data)
      }
    }
    emitter.on(event, handler)
    onBeforeUnmount(() => {
      emitter.off(event, handler)
    })
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        trigger()
      }
    }
  })
}
