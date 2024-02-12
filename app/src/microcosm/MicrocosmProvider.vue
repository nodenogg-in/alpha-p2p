<script setup lang="ts">
import { provide, onBeforeUnmount } from 'vue'
import {
  useMicrocosm,
  MICROCOSM_DATA_INJECTION_KEY,
  MICROCOSM_URI_INJECTION_KEY
} from '@/state'
import { isValidMicrocosmURI } from 'nodenoggin-core/utils';

const props = defineProps({
  microcosm_uri: {
    type: String,
    required: true
  }
})

provide(MICROCOSM_URI_INJECTION_KEY, props.microcosm_uri)

const store = useMicrocosm(props.microcosm_uri)
store?.join()

provide(MICROCOSM_DATA_INJECTION_KEY, store)

onBeforeUnmount(() => {
  store.leave()
})
</script>

<template>
  <slot v-if="!!store && props.microcosm_uri && isValidMicrocosmURI(props.microcosm_uri)"></slot>
</template>
