<script setup lang="ts">
import type { PropType } from 'vue';
import { MicrocosmNav, MicrocosmProvider } from '.'
import { views } from '@/views'
import { viewNames, type ViewName } from 'nodenoggin-core';
import { useApp } from '@/state';

const app = useApp()

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
    <section :class="{ container: true, 'menu-open': app.menuOpen }">
      <MicrocosmNav v-if="props.primary" />
      <KeepAlive :include="Array.from(viewNames)">
        <component v-if="views[props.view]" :is="views[props.view]" />
      </KeepAlive>
    </section>
  </MicrocosmProvider>
</template>

<style scoped>
.container {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 97;
  width: 100%;
  height: 100%;
}

.container.menu-open {
  width: calc(100% - var(--app-menu-width));
}
</style>