<script setup lang="ts">
import { onBeforeUnmount, provide, type PropType } from 'vue';
import { MicrocosmNav } from '.'
import { views } from '@/views'
import { viewNames, type ViewName } from 'nodenoggin/schema';
import MicrocosmContainer from './MicrocosmContainer.vue';
import { MICROCOSM_DATA_INJECTION_KEY, useMicrocosm } from '@/state';

const props = defineProps({
  microcosm_uri: {
    type: String,
    required: true
  },
  primary: {
    type: Boolean,
    default: false
  },
  view: {
    type: String as PropType<ViewName>,
    required: true
  }
})

const microcosm = useMicrocosm(props.microcosm_uri, props.view)

microcosm?.join()

provide(MICROCOSM_DATA_INJECTION_KEY, microcosm)

onBeforeUnmount(() => {
  microcosm.leave()
})

</script>

<template>
  <MicrocosmContainer v-if="microcosm.status.ready">
    <MicrocosmNav v-if="primary" />
    <KeepAlive :include="Array.from(viewNames)">
      <component v-if="views[view]" :is="views[view]" />
    </KeepAlive>
  </MicrocosmContainer>
</template>

