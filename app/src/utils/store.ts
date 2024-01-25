import { defineStore } from 'pinia'

export const defineViewStore = <T extends Record<string, any>>(
  type: string,
  microcosm_uri: string,
  setup: () => T
) => defineStore(`view/${type}/${microcosm_uri}`, setup)
