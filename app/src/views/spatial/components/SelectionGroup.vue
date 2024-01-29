<script lang="ts" setup>
import { computed } from 'vue'
import { useCurrentSpatialView } from '@/views/spatial'

const view = useCurrentSpatialView()
const style = computed(() => {
  const box = view.canvasToScreen(view.selection.selection.group)
  return {
    width: `${box.width}px`,
    height: `${box.height}px`,
    transform: `translate(${box.x}px, ${box.y}px)`
  }
})
</script>

<template>
  <div v-if="view.selection.selection.nodes.length" class="selection-group" :style="style"
    :data-label="`${view.selection.selection.nodes.length}`" />
</template>

<style scoped>
.selection-group {
  position: absolute;
  z-index: 100;
  box-shadow: var(--ui-shadow-accent);
  top: 0;
  left: 0;
  border-radius: var(--ui-radius);
  transform-origin: 0% 0%;
  display: flex;
  align-items: center;
  pointer-events: none;
}
</style>
