<script setup lang="ts">
import { onBeforeUnmount, provide } from 'vue'
import { createSpatialView, SPATIAL_VIEW_INJECTION_KEY, Tool } from './stores/use-spatial-view'
import { useCurrentMicrocosm } from '@/microcosm/stores'
import { tinykeys } from '@/utils/libs/tinykeys';

const props = defineProps({
  microcosm_uri: {
    type: String,
    required: true
  }
})

const microcosm = useCurrentMicrocosm()
const view = createSpatialView(props.microcosm_uri, microcosm)

provide(SPATIAL_VIEW_INJECTION_KEY, view)

const unsubscribe = tinykeys(window, {
  '$mod+C': () => {
    console.log('copy')
  },
  '$mod+X': () => {
    console.log('cut')
  },
  '$mod+V': () => {
    console.log('paste')
  },
  '$mod+Shift+Z': () => {
    if (!view.editingNode) {
      microcosm.redo()
      view.setTool()
    }
  },
  '$mod+Z': () => {
    if (!view.editingNode) {
      microcosm.undo()
      view.setTool()
    }
  },
  'Backspace': () => {
    if (!view.editingNode) {
      view.selectedNodes.forEach(node => {
        microcosm.delete(node)
      })
      view.setTool()
    }
  },
  'Escape': () => {
    view.setTool(Tool.Select)
  },
  n: () => {
    if (!view.editingNode) {
      view.setTool(Tool.New)
    }
  },
  v: () => {
    if (!view.editingNode) {
      view.setTool(Tool.Select)
    }
  },
  h: () => {
    if (!view.editingNode) {
      view.setTool(Tool.Move)
    }
  }
})

onBeforeUnmount(() => {
  unsubscribe()
})
</script>

<template>
  <slot v-if="!!view && props.microcosm_uri"></slot>
</template>
