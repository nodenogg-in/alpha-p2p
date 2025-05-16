<script setup lang="ts">
import { provide, type PropType } from 'vue'
import type { MicrocosmUUID } from '@nodenogg.in/core'
import MicrocosmContainer from './MicrocosmContainer.vue'
import {
  MICROCOSM_DATA_INJECTION_KEY,
  useApp,
  useMicrocosm,
} from '@/state'
import SimpleView from '@/views/spatial/SimpleView.vue'

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
const microcosm = await useMicrocosm(props.microcosmUUID)

provide(MICROCOSM_DATA_INJECTION_KEY, microcosm)
</script>

<template>
  <MicrocosmContainer v-if="microcosm.status.ready && app.ready && app.identity">
    <!-- <MicrocosmNav :title="microcosm.microcosmUUID" v-if="ui && app.state.showUI" /> -->
    <!-- <SpatialView :ui="ui" :view_id="id" /> -->
    <SimpleView :ui="ui" :view_id="id" />
  </MicrocosmContainer>
</template>
