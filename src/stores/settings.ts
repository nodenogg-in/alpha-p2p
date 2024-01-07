import { useLocalPrimitive } from '@/utils/local-storage'
import { defineStore } from 'pinia'
import { string } from 'valibot'

const SETTINGS_STORE_NAME = 'settings' as const

const DEFAULT_NAMESPACE = 'me'

const localStoragePath = [SETTINGS_STORE_NAME, 'namespace']

export const useSettings = defineStore(SETTINGS_STORE_NAME, () => {
  const namespace = useLocalPrimitive(localStoragePath, string(), DEFAULT_NAMESPACE)

  return {
    namespace
  }
})
