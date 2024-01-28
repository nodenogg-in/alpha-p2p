<script setup lang="ts">
import { onBeforeUnmount, provide } from 'vue'
import { createSpatialView, SPATIAL_VIEW_INJECTION_KEY, Tool } from './stores/use-spatial-view'
import { useApp, useCurrentMicrocosm } from '@/microcosm/stores'
import { tinykeys } from '@/utils/libs/tinykeys';

const props = defineProps({
  microcosm_uri: {
    type: String,
    required: true
  }
})

const app = useApp()
const microcosm = useCurrentMicrocosm()
const view = createSpatialView(props.microcosm_uri, microcosm)

provide(SPATIAL_VIEW_INJECTION_KEY, view)

const filterInputEvents = (callback: (e: KeyboardEvent) => void) =>
  (e: KeyboardEvent) => {
    const isInput = e.target instanceof HTMLInputElement
    const isContentEditable = e.target instanceof HTMLElement && e.target.isContentEditable
    const isTextArea = e.target instanceof HTMLTextAreaElement

    if (!isInput && !isContentEditable && !isTextArea) {
      callback(e)
    }
  }

const unsubscribe = tinykeys(window, {
  '$mod+C': filterInputEvents(() => {
    console.log('copy')
  }),
  '$mod+X': filterInputEvents(() => {
    console.log('cut')
  }),
  '$mod+V': filterInputEvents(() => {
    console.log('paste')
  }),
  '$mod+Shift+Z': filterInputEvents(() => {
    if (!view.editingNode) {
      microcosm.redo()
      view.setTool()
    }
  }),
  '$mod+Z': filterInputEvents(() => {
    if (!view.editingNode) {
      microcosm.undo()
      view.setTool()
    }
  }),
  'Backspace': filterInputEvents(() => {
    if (!view.editingNode) {
      view.selectedNodes.forEach(node => {
        microcosm.delete(node)
      })
      view.setTool()
    }
  }),
  'Escape': () => {
    view.setTool(Tool.Select)
  },
  n: filterInputEvents(() => {
    if (!view.editingNode) {
      view.setTool(Tool.New)
    }
  }),
  s: filterInputEvents(() => {
    if (!view.editingNode) {
      app.sidebarOpen = !app.sidebarOpen
    }
  }),
  v: filterInputEvents(() => {
    if (!view.editingNode) {
      view.setTool(Tool.Select)
    }
  }),
  h: filterInputEvents(() => {
    if (!view.editingNode) {
      view.setTool(Tool.Move)
    }
  })
})

onBeforeUnmount(() => {
  unsubscribe()
})
</script>

<template>
  <slot v-if="!!view && props.microcosm_uri"></slot>
</template>
