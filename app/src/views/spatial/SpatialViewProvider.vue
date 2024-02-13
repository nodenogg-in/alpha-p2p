<script setup lang="ts">
import { provide } from 'vue'
import { createSpatialView, SPATIAL_VIEW_INJECTION_KEY } from './use-spatial-view'
import { useCurrentMicrocosm } from '@/state'

const props = defineProps({
  microcosm_uri: {
    type: String,
    required: true
  }
})

const microcosm = useCurrentMicrocosm()
const view = createSpatialView(props.microcosm_uri, microcosm)

provide(SPATIAL_VIEW_INJECTION_KEY, view)

</script>

<template>
  <slot v-if="!!view && props.microcosm_uri"></slot>
</template>