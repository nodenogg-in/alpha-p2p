<script lang="ts" setup>
import { useCurrentSpatialView } from '..'
import { boxStyle } from '@nodenogg.in/core/spatial'
import { computed } from 'vue'

const view = useCurrentSpatialView()
const canvasContainer = computed(() => boxStyle(view.viewport.canvas))
</script>

<template>
  <div class="canvas-container" :style="canvasContainer">
    <pre> {{ JSON.stringify(canvasContainer, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 500px;
  background: red;
  opacity: 0.15;
  transform-origin: 0% 0%;
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  white-space: pre-wrap;
}

pre {
  border: 2px dashed black;
  width: 100%;
}
</style>
