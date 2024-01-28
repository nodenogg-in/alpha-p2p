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
  box-shadow: 0 0 0 5px rgba(50, 40, 255, 0.1);
  font-size: 10px;
  top: 0;
  left: 0;
  border-radius: 2px;
  transform-origin: 0% 0%;
  padding: 10px;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.selection-group::after {
  position: absolute;
  background: rgba(50, 40, 255, 1);
  content: attr(data-label);
  padding: 1px 4px;
  border-radius: 2px;
  color: white;
  top: -10px;
  left: -10px;
}
</style>
