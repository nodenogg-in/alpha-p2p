<script setup lang="ts">
import { provide, type PropType } from 'vue'
import MicrocosmNav from './MicrocosmNav.vue'
import type { MicrocosmID } from '@nodenogg.in/microcosm'
import MicrocosmContainer from './MicrocosmContainer.vue'
import {
  MICROCOSM_DATA_INJECTION_KEY,
  VIEW_STATE_KEY,
  useApp,
  useMicrocosm,
  useView,
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
const view = useView(props.microcosmID, props.id)

provide(MICROCOSM_DATA_INJECTION_KEY, microcosm)
provide(VIEW_STATE_KEY, view)
</script>

<template>
  <MicrocosmContainer v-if="microcosm.status.ready && app.ready">
    <MicrocosmNav :title="microcosm.microcosmID" v-if="ui && app.state.showUI" />
    <SpatialView :ui="ui" />
  </MicrocosmContainer>
</template>
