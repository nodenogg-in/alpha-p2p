<script setup lang="ts">
import { MicrocosmNav, MicrocosmProvider } from '.'
import * as views from '@/views'
import type { PropType } from 'vue';

const props = defineProps({
  microcosm_uri: {
    type: String,
    required: true
  },
  view: {
    type: String as PropType<views.ViewName>,
    required: true
  }
})

</script>

<template>
  <MicrocosmProvider :microcosm_uri="props.microcosm_uri">
    <div class="microcosm-container">
      <MicrocosmNav />
      <component :is="views[props.view]"></component>
    </div>
  </MicrocosmProvider>
</template>

<style scoped>
.microcosm-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
