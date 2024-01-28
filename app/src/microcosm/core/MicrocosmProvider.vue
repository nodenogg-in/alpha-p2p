<script setup lang="ts">
import { provide, onBeforeUnmount } from 'vue'
import {
  useMicrocosm,
  MICROCOSM_DATA_INJECTION_KEY,
  MICROCOSM_URI_INJECTION_KEY
} from '@/microcosm/stores'
import { useRouter } from 'vue-router';
import { isValidMicrocosmURI } from './utils';

const props = defineProps({
  microcosm_uri: {
    type: String,
    required: true
  }
})

const router = useRouter()

if (!isValidMicrocosmURI(props.microcosm_uri)) {
  router.push({
    name: 'NotFound',
    query: {
      message: `${props.microcosm_uri} is not a valid microcosm URI`
    }
  })
}

const store = useMicrocosm(props.microcosm_uri)

provide(MICROCOSM_DATA_INJECTION_KEY, store)
provide(MICROCOSM_URI_INJECTION_KEY, props.microcosm_uri)

onBeforeUnmount(() => {
  store.leave()
})
</script>

<template>
  <slot v-if="!!store && props.microcosm_uri"></slot>
</template>
