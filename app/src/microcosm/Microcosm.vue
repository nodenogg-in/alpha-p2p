<script setup lang="ts">
import { provide } from 'vue';
import { MicrocosmNav } from '.'
import { views } from '@/views'
import { viewTypes } from 'nodenoggin/schema';
import MicrocosmContainer from './MicrocosmContainer.vue';
import { MICROCOSM_DATA_INJECTION_KEY, VIEW_STATE_KEY, useApp, useMicrocosm, useView } from '@/state';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  microcosm_uri: {
    type: String,
    required: true
  },
  ui: {
    type: Boolean,
    default: false
  }
})

const app = useApp()
const microcosm = useMicrocosm(props.microcosm_uri)
const view = useView(props.id)

provide(MICROCOSM_DATA_INJECTION_KEY, microcosm)
provide(VIEW_STATE_KEY, view)
</script>

<template>
  <MicrocosmContainer v-if="microcosm.status.ready">
    <MicrocosmNav v-if="ui && app.state.showUI" />
    <KeepAlive :include="Array.from(viewTypes)">
      <component v-if="views[view.type]" :is="views[view.type]" :ui="ui" />
    </KeepAlive>
  </MicrocosmContainer>
</template>
