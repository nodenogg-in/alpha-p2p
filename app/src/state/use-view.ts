import { DEFAULT_VIEW, type ViewType } from '@nodenogg.in/core/schema'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export const useView = (microcosm_uri: string, view_id: string) =>
  defineStore(`microcosm/${microcosm_uri}/${view_id}`, () => {
    const type = ref<ViewType>(DEFAULT_VIEW)

    return {
      type,
      view_id
    }
  })()

export type ViewState = ReturnType<typeof useView>

export const VIEW_STATE_KEY = 'VIEW_STATE'

export const useCurrentView = () => inject<ViewState>(VIEW_STATE_KEY) as ViewState
