<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentSpatialView } from '@/views/spatial/stores/use-spatial-view'

const view = useCurrentSpatialView()
const style = computed(() => ({
  transform: `translate(${view.transform.translate.x + view.container.width / 2}px, ${view.transform.translate.y + view.container.height / 2}px) scale(${view.transform.scale}) `
}))
</script>

<template>
  <div @contextmenu.prevent.self @click.prevent.self @touchstart.prevent.self :style="style" class="canvas-surface"
    role="presentation">
    <section class="canvas-background" :style="{
      width: `${view.canvas.width}px`,
      height: `${view.canvas.height}px`,
      backgroundSize: `${view.grid}px ${view.grid}px`
    }">
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
  top: -50%;
  left: -50%;
  transform-origin: 50% 50%;
  pointer-events: none !important;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.canvas-background {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  position: absolute;
  background-image: linear-gradient(to right, rgb(240, 240, 240) 1px, rgba(240, 238, 221, 0.2) 1px),
    linear-gradient(to bottom, rgb(240, 240, 240) 1px, rgba(240, 238, 221, 0.2) 1px);
}

/* .canvas-background.dots {
    background-image: radial-gradient(rgb(220, 220, 220) 2px, rgba(150, 150, 150, 0.0) 2px);
    background-size: 20px 20px;
    background-position: -9.5px -9.5px;
} */
</style>
