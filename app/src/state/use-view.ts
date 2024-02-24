import { DEFAULT_VIEW, type ViewName, createUuid } from 'nodenoggin'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export const useView = (view_id: string = createUuid()) =>
  defineStore(`${view_id}`, () => {
    const type = ref<ViewName>(DEFAULT_VIEW)

    return {
      type,
      view_id
    }
  })()

export type ViewState = ReturnType<typeof useView>

export const VIEW_STATE_KEY = 'VIEW_STATE'

export const useCurrentView = () => inject<ViewState>(VIEW_STATE_KEY) as ViewState
