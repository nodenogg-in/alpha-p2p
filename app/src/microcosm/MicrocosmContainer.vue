
<script setup lang="ts">
import { ref } from 'vue';
import { useDropZone } from '@vueuse/core';
import { useApp } from '@/state';
import { VALID_MIME_TYPES } from 'nodenoggin/utils';

const app = useApp()
// const microcosm = useCurrentMicrocosm()

const element = ref<HTMLElement>()

const { isOverDropZone } = useDropZone(element, {
  onDrop: console.log,
  dataTypes: VALID_MIME_TYPES
})

</script>

<template>
  <div ref="element" :class="{
    container: true,
    'drop-active': isOverDropZone,
    'menu-open': app.state.menuOpen
  }">
    <slot></slot>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

