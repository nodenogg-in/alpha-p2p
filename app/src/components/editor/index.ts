import { defineAsyncComponent } from 'vue'
export const renderer = defineAsyncComponent(() => import('./Renderer.vue'))
export const editor = defineAsyncComponent(() => import('./Editor.vue'))
