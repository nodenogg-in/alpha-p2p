<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentSpatialView } from '@/views/spatial/stores/use-spatial-view'
import { transformToCSSMatrix } from '../utils/css'

const view = useCurrentSpatialView()

const style = computed(() => ({
  transform: transformToCSSMatrix(view.transform)
}))
</script>

<template>
  <div @contextmenu.prevent.self @click.prevent.self @touchstart.prevent.self :style="style" class="canvas-surface"
    role="presentation">
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
}

.canvas-background {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
