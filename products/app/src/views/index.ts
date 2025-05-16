import { defineAsyncComponent, type Component } from 'vue'

export const viewComponents: Record<string, Component> = {
  collect: defineAsyncComponent(() => import('./collect/CollectView.vue'))
}
