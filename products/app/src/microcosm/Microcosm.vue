<script setup lang="ts">
import { computed, provide, type PropType } from 'vue'
import type { MicrocosmUUID } from '@nodenogg.in/core'
import MicrocosmContainer from './MicrocosmContainer.vue'
import MicrocosmNav from './MicrocosmNav.vue'
import {
  MICROCOSM_DATA_INJECTION_KEY,
  useApp,
  useAppRouter,
  useMicrocosm,
} from '@/state'
import { getViewComponent } from '@/views'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  microcosmUUID: {
    type: String as unknown as PropType<MicrocosmUUID>,
    required: true
  },
  ui: {
    type: Boolean,
    default: false
  }
})

const app = useApp()
const router = useAppRouter()
const microcosm = await useMicrocosm(props.microcosmUUID)

// Get the current view component based on the URL parameter
const ActiveViewComponent = computed(() => {
  return getViewComponent(router.value.viewType)
})

provide(MICROCOSM_DATA_INJECTION_KEY, microcosm)
</script>

<template>
  <MicrocosmContainer v-if="microcosm.status.ready && app.ready && app.identity">
    <MicrocosmNav v-if="ui && app.state.showUI" />
    <component :is="ActiveViewComponent" :ui="ui" :view_id="id" />
  </MicrocosmContainer>
</template>
