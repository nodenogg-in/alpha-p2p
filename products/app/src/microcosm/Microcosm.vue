<script setup lang="ts">
import { provide, type PropType } from 'vue'
import MicrocosmNav from './MicrocosmNav.vue'
import type { MicrocosmID } from '@nodenogg.in/microcosm'
import MicrocosmContainer from './MicrocosmContainer.vue'
import {
  MICROCOSM_DATA_INJECTION_KEY,
  useApp,
  useMicrocosm,
} from '@/state'
import SpatialView from '@/views/spatial/SpatialView.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  microcosmID: {
    type: String as unknown as PropType<MicrocosmID>,
    required: true
  },
  ui: {
    type: Boolean,
    default: false
  }
})

const app = useApp()
const microcosm = await useMicrocosm(props.microcosmID)

provide(MICROCOSM_DATA_INJECTION_KEY, microcosm)
</script>

<template>
  <MicrocosmContainer v-if="microcosm.status.ready && app.ready && app.identity">
    <MicrocosmNav :title="microcosm.microcosmID" v-if="ui && app.state.showUI" />
    <SpatialView :ui="ui" :view_id="id" />
  </MicrocosmContainer>
</template>
