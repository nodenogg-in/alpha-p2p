<script setup lang="ts">
import { provide, onBeforeUnmount, type PropType } from 'vue'
import {
  useMicrocosm,
  MICROCOSM_DATA_INJECTION_KEY,
  MICROCOSM_URI_INJECTION_KEY
} from '@/state'
import { isValidMicrocosmURI } from 'nodenoggin/utils';
import type { ViewName } from 'nodenoggin/schema';
import { SPATIAL_VIEW_INJECTION_KEY } from '@/views/spatial/stores/use-spatial-view';

const props = defineProps({
  view: {
    type: String as PropType<ViewName>,
    required: true
  },
  microcosm_uri: {
    type: String,
    required: true
  }
})

provide(MICROCOSM_URI_INJECTION_KEY, props.microcosm_uri)

const store = useMicrocosm(props.microcosm_uri, props.view)

store?.join()

provide(MICROCOSM_DATA_INJECTION_KEY, store)
provide(SPATIAL_VIEW_INJECTION_KEY, store.spatial)

onBeforeUnmount(() => {
  store.leave()
})
</script>

<template>
  <slot v-if="!!store && props.microcosm_uri && isValidMicrocosmURI(props.microcosm_uri)"></slot>
</template>
