import { useLocalRef } from '@/utils/local-storage'
import { defineStore } from 'pinia'
import { string } from 'valibot'

const SETTINGS_STORE_NAME = 'settings' as const

const DEFAULT_NAMESPACE = 'me'

export const useSettings = defineStore(SETTINGS_STORE_NAME, () => {
  const namespace = useLocalRef([SETTINGS_STORE_NAME, 'namespace'], string(), DEFAULT_NAMESPACE)

  return {
    namespace
  }
})
