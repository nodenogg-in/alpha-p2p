import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useVisibility = (fn: (visible: boolean) => void) => {
  const visible = ref<boolean>(true)

  const listener = () => {
    const isVisible = document.visibilityState !== 'hidden'
    visible.value = isVisible
    fn(isVisible)
  }

  onMounted(listener)

  document.addEventListener('visibilitychange', listener)

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', listener)
  })
  return visible
}
