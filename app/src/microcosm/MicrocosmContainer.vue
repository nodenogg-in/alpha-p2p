
<script setup lang="ts">
import { ref } from 'vue';
import { useDropZone } from '@vueuse/core';
import { useApp, useCurrentMicrocosm } from '@/state';
import { VALID_MIME_TYPES } from 'nodenoggin/utils';

const app = useApp()
const microcosm = useCurrentMicrocosm()

const element = ref<HTMLElement>()

const { isOverDropZone } = useDropZone(element, {
  onDrop: microcosm.actions.onDropFiles,
  dataTypes: VALID_MIME_TYPES
})

</script>

<template>
  <div ref="element" :class="{
    container: true,
    'drop-active': isOverDropZone,
    'menu-open': app.menuOpen
  }">
    <slot></slot>
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.container.menu-open {
  width: calc(100% - var(--app-menu-width));
  left: var(--app-menu-width);
}
</style>

