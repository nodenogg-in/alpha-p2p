<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentSpatialView } from '@/views/spatial/stores/use-spatial-view'
import { transform } from '../utils/css'

const view = useCurrentSpatialView()

const style = computed(() => ({
  transform: transform(view.transform)
}))
</script>

<template>
  <div class="canvas-surface" role="presentation">
    <section class="canvas-background">
      <slot></slot>
    </section>
  </div>
</template>

<style scoped>
.canvas-surface {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform-origin: 50% 50%;
  pointer-events: none !important;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transform: translate(var(--spatial-view-translate-x), var(--spatial-view-translate-y)) scale(var(--spatial-view-scale));
  /* transform: matrix(var(--spatial-view-scale), 0, 0, var(--spatial-view-scale), var(--spatial-view-translate-x), var(--spatial-view-translate-y)); */
}

.canvas-background {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
