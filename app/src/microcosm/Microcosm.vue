<script setup lang="ts">
import type { PropType } from 'vue';
import { MicrocosmNav, MicrocosmProvider } from '.'
import { views } from '@/views'
import { viewNames, type ViewName } from 'nodenoggin-core';
import MicrocosmContainer from './MicrocosmContainer.vue';

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
</script>

<template>
  <MicrocosmProvider :microcosm_uri="props.microcosm_uri" :view="props.view">
    <MicrocosmContainer>
      <MicrocosmNav v-if="props.primary" />
      <KeepAlive :include="Array.from(viewNames)">
        <component v-if="views[props.view]" :is="views[props.view]" />
      </KeepAlive>
    </MicrocosmContainer>
  </MicrocosmProvider>
</template>

