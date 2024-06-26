import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export const useView = (microcosmID: string, view_id: string) =>
  defineStore(`microcosm/${microcosmID}/${view_id}`, () => {
    return {
      view_id
    }
  })()

export type ViewState = ReturnType<typeof useView>

export const VIEW_STATE_KEY = 'VIEW_STATE'

export const useCurrentView = () => inject<ViewState>(VIEW_STATE_KEY) as ViewState
