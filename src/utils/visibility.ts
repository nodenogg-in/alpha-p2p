import { onBeforeUnmount, onMounted } from 'vue'

export const useVisibilityChange = (fn: (visible: boolean) => void) => {
  const listener = () => {
    fn(document.visibilityState !== 'hidden')
  }

  onMounted(listener)

  document.addEventListener('visibilitychange', listener)

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', listener)
  })
}
