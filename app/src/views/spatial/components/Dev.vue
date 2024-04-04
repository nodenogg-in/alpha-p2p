<script lang="ts" setup>
import { computed } from 'vue'
import { boxStyle } from '@nodenogg.in/infinitykit'
import { useSignal } from '@nodenogg.in/statekit/vue';
import { signal } from '@nodenogg.in/statekit';
import { useCurrentSpatialView } from '..'
import { ui } from '@/state';

const view = useCurrentSpatialView()
const canvasContainer = computed(() => boxStyle(view.viewport.canvas))

const sig = useSignal(signal((get) => {
  const pointer = get(ui.screen.key('pointer'))
  const point = pointer.point
  const active = pointer.active
  const xy = view.interaction.screenToCanvas(point)
  return `transform: translate(${xy.x}px, ${xy.y}px) scale(${active ? 1.25 : 1.0}, ${active ? 1.25 : 1.0});`
}))

</script>

<template>
  <div class="indicator" :style="sig">
    {{ JSON.stringify(sig) }}
  </div>
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

.indicator {
  width: 30px;
  height: 30px;
  left: -15px;
  top: -15px;
  position: absolute;
  background: rgba(150, 0, 230, 0.3);
  pointer-events: none;
  z-index: 10000;
  border-radius: 50%;
}

pre {
  border: 2px dashed black;
  width: 100%;
}
</style>
