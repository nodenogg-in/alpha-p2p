<script setup lang="ts">
import { provide, type PropType } from 'vue'
import MicrocosmNav from './MicrocosmNav.vue'
import { viewComponents } from '@/views'
import type { MicrocosmID } from '@nodenogg.in/microcosm'
import MicrocosmContainer from './MicrocosmContainer.vue'
import {
  MICROCOSM_DATA_INJECTION_KEY,
  VIEW_STATE_KEY,
  useApp,
  useMicrocosm,
  useView,
  views
} from '@/state'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  MicrocosmID: {
    type: String as unknown as PropType<MicrocosmID>,
    required: true
  },
  ui: {
    type: Boolean,
    default: false
  }
})

const app = useApp()
const microcosm = await useMicrocosm(props.MicrocosmID)
const view = useView(props.MicrocosmID, props.id)

provide(MICROCOSM_DATA_INJECTION_KEY, microcosm)
provide(VIEW_STATE_KEY, view)
</script>

<template>
  <MicrocosmContainer v-if="microcosm.status.ready && app.ready">
    <MicrocosmNav :title="microcosm.MicrocosmID" v-if="ui && app.state.showUI" />
    <KeepAlive :include="views.types">
      <component v-if="viewComponents[view.type]" :is="viewComponents[view.type]" :ui="ui" />
    </KeepAlive>
  </MicrocosmContainer>
</template>
