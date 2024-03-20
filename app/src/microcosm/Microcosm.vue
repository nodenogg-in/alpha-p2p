<script setup lang="ts">
import { provide } from 'vue';
import { MicrocosmNav } from '.'
import { views } from '@/views'
import { viewNames } from 'nodenoggin/schema';
import MicrocosmContainer from './MicrocosmContainer.vue';
import { MICROCOSM_DATA_INJECTION_KEY, VIEW_STATE_KEY, useMicrocosm, useView } from '@/state';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  microcosm_uri: {
    type: String,
    required: true
  },
  navigation: {
    type: Boolean,
    default: false
  }
})

const microcosm = useMicrocosm(props.microcosm_uri)
const view = useView(props.id)

provide(MICROCOSM_DATA_INJECTION_KEY, microcosm)
provide(VIEW_STATE_KEY, view)
</script>

<template>
  <MicrocosmContainer v-if="microcosm.status.ready">
    <MicrocosmNav v-if="navigation" />
    <KeepAlive :include="Array.from(viewNames)">
      <component v-if="views[view.type]" :is="views[view.type]" />
    </KeepAlive>
  </MicrocosmContainer>
</template>

