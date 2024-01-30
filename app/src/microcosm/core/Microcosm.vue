<script setup lang="ts">
import type { PropType } from 'vue';
import { viewNames } from '@/utils/hooks/use-route-microcosms';
import { MicrocosmNav, MicrocosmProvider } from '.'
import * as Views from '@/views'

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
    type: String as PropType<Views.ViewName>,
    required: true
  }
})
</script>

<template>
  <MicrocosmProvider :microcosm_uri="props.microcosm_uri">
    <section class="container">
      <MicrocosmNav v-if="props.primary" />
      <KeepAlive :include="viewNames">
        <component v-if="Views[props.view]" :is="Views[props.view]" />
      </KeepAlive>
    </section>
  </MicrocosmProvider>
</template>

<style scoped>
.container {
  position: absolute;
  top: 0;
  z-index: 2;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
