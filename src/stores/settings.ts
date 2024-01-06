import { set, get } from '@/utils/local-storage'
import { defineStore } from 'pinia'
import { string } from 'valibot'
import { ref } from 'vue'

const SETTINGS_STORE_NAME = 'settings' as const

const DEFAULT_NAMESPACE = 'me'

const localStoragePath = [SETTINGS_STORE_NAME, 'namespace']

export const useSettings = defineStore(SETTINGS_STORE_NAME, () => {
  const defaultNamespace = get(localStoragePath, string(), DEFAULT_NAMESPACE)
  const namespace = ref<string>(defaultNamespace)

  const setNamespace = (n: string) => {
    namespace.value = n
    set(localStoragePath, namespace.value)
  }

  return { namespace, setNamespace }
})
