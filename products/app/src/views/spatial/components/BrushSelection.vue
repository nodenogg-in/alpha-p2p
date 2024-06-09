<script lang="ts" setup>
import { boxStyle } from '@figureland/infinitykit'
import { useDerived } from '@figureland/statekit/vue';
import { useCurrentSpatialView } from '..'
const view = useCurrentSpatialView()

const brush = useDerived(get => {
  const box = get(view.infinitykit.state).brush
  return `${boxStyle(box)};`
})


</script>

<template>
  <div class="box" :style="brush"></div>
  <!-- <div class="checker">
    <pre>
      {{ JSON.stringify(s, null, 2) }}
    </pre>
  </div> -->
  <!-- <div class="indicator" :style="animatedStyle"> -->
  <!-- <pre style="transform: scale(var(--card-element-scale))">{{ JSON.stringify(style, null, 2) }}</pre> -->
  <!-- </div> -->
  <!-- <div class="canvas-container" :style="canvasContainer">
    <pre> {{ JSON.stringify(canvasContainer, null, 2) }}</pre>
  </div> -->
  <!-- <div class="box" :style="demoBox">{{ JSON.stringify(demoBox, null, 2) }}</div> -->
  <!-- <Sticker :size="400" text="B" /> -->
</template>

<style scoped>
.box {
  position: absolute;
  top: 0;
  left: 0;
  /* background: var(--ui-primary-100); */
  z-index: 500;
  box-shadow: 0 0 0 calc(1px * var(--infinitykit-inverted-scale)) var(--ui-primary-100);
}
</style>
