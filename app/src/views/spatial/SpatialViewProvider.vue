<script setup lang="ts">
import { onBeforeUnmount, provide } from 'vue'
import { createSpatialView, SPATIAL_VIEW_INJECTION_KEY, Tool } from './stores/use-spatial-view'
import { useCurrentMicrocosm } from '@/microcosm/stores/microcosm'
import { tinykeys } from '@/utils/libs/tinykeys';

const props = defineProps({
  microcosm_uri: {
    type: String,
    required: true
  }
})

const microcosm = useCurrentMicrocosm()
const view = createSpatialView(props.microcosm_uri)

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
    microcosm.redo()
  },
  '$mod+Z': () => {
    microcosm.undo()
  },
  Backspace: () => {
    console.log('delete')
  },
  Escape: () => {
    view.setTool(Tool.Select)
  },
  n: () => {
    view.setTool(Tool.New)
  },
  v: () => {
    view.setTool(Tool.Select)
  },
  h: () => {
    view.setTool(Tool.Move)
  }
})

onBeforeUnmount(() => {
  unsubscribe()
})
</script>

<template>
  <slot v-if="!!view && props.microcosm_uri"></slot>
</template>
@/microcosm/stores/microcosm
