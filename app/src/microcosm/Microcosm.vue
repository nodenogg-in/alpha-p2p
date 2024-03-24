<script setup lang="ts">
import { provide, type PropType } from 'vue'
import { MicrocosmNav } from '.'
import { viewComponents } from '@/views'
import type { Microcosm_URI } from '@nodenogg.in/microcosm'
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
  microcosm_uri: {
    type: String as unknown as PropType<Microcosm_URI>,
    required: true
  },
  ui: {
    type: Boolean,
    default: false
  }
})

const app = useApp()
const microcosm = await useMicrocosm(props.microcosm_uri)
const view = useView(props.microcosm_uri, props.id)

provide(MICROCOSM_DATA_INJECTION_KEY, microcosm)
provide(VIEW_STATE_KEY, view)
</script>

<template>
  <MicrocosmContainer v-if="microcosm.status.ready && app.ready">
    <MicrocosmNav v-if="ui && app.state.showUI" />
    <KeepAlive :include="views.types">
      <component v-if="viewComponents[view.type]" :is="viewComponents[view.type]" :ui="ui" />
    </KeepAlive>
  </MicrocosmContainer>
</template>
