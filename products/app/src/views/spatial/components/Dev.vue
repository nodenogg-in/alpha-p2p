<script lang="ts" setup>
import { boxStyle } from '@figureland/infinitykit'
import { useDerived, useSubscribable } from '@figureland/statekit/vue';
import { signal } from '@figureland/statekit';
import { useCurrentSpatialView } from '..'
import { app } from '@/state';

const view = useCurrentSpatialView()
const canvasContainer = useSubscribable(signal((get) => {
  get(view.interaction.transform)
  const box = view.interaction.transform.screenToCanvas(get(view.interaction.viewport))
  return boxStyle({ ...box, width: box.width * 0.5, height: box.height })
}))

const style = useDerived((get) => {
  get(view.interaction.transform)
  const pointer = get(app.pointer)
  const xy = view.interaction.transform.screenToCanvas(pointer.point)
  return `transform: translate(${xy.x}px, ${xy.y}px) scale(calc(${pointer.active ? 1.0 : 0.75} * var(--card-element-scale)));`
})

const demoBox = useDerived(get => {
  get(view.interaction.transform)
  const b = {
    x: 0,
    y: 200,
    width: 100,
    height: 200
  }
  return boxStyle(view.interaction.transform.screenToCanvas(b))
})

const s = useSubscribable(view.interaction.transform)

</script>

<template>
  <!-- <div class="checker">
    <pre>
      {{ JSON.stringify(s, null, 2) }}
    </pre>
  </div> -->
  <div class="indicator" :style="style">
    <!-- <pre style="transform: scale(var(--card-element-scale))">{{ JSON.stringify(style, null, 2) }}</pre> -->
  </div>
  <!-- <div class="canvas-container" :style="canvasContainer">
    <pre> {{ JSON.stringify(canvasContainer, null, 2) }}</pre>
  </div> -->
  <div class="box" :style="demoBox">{{ JSON.stringify(demoBox, null, 2) }}</div>
</template>

<style scoped>
.box {
  position: absolute;
  top: 0;
  left: 0;
  background: black;
  color: white;
  z-index: 500;
}

.checker {
  position: absolute;
  top: 0;
  left: 0;
  width: 1000px;
  height: 1000px;
  z-index: -1;
  background:
    repeating-conic-gradient(rgb(210, 210, 210) 0% 25%, transparent 0% 50%) 50% / 10px 10px
}

.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 500px;
  background: red;
  opacity: 0.85;
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
  background: rgba(150, 0, 230, 0.75);
  pointer-events: none;
  z-index: 10000;
  border-radius: 50%;
}

pre {
  border: 2px dashed black;
  width: 100%;
}
</style>
