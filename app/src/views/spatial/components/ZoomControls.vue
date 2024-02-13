<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'radix-vue'
import { computed } from 'vue'

import { ZOOM_INCREMENT, MIN_ZOOM, MAX_ZOOM } from 'nodenoggin-core/canvas'
import { useCurrentSpatialView } from '@/views/spatial'
import Tooltip from './Tooltip.vue';

const view = useCurrentSpatialView()

const scale = computed(() => [view.canvas.transform.scale])

const handleChange = (n?: number[]) => {
  if (n) {
    view.zoom(n[0])
  }
}

const scaleDisplay = computed(() =>
  `${Math.round(view.canvas.transform.scale * 100)}%`
)
</script>
<template>
  <SliderRoot @update:modelValue="handleChange" :model-value="scale" class="slider-root" :max="MAX_ZOOM" :min="MIN_ZOOM"
    orientation="vertical" :step="ZOOM_INCREMENT">
    <SliderTrack class="slider-track">
      <SliderRange class="slider-range"> </SliderRange>
    </SliderTrack>
    <Tooltip tooltip="Zoom" :key-command="scaleDisplay" side="left" disableClosingTrigger>
      <SliderThumb class="slider-thumb" aria-label="Zoom canvas" />
    </Tooltip>
  </SliderRoot>
</template>

<style>
.slider-root {
  position: absolute;
  display: flex;
  align-items: center;
  touch-action: none;
  z-index: 50000;
  width: 20px;
  bottom: 15px;
  right: 15px;
  border-radius: 10px;
  background: var(--ui-100);
  box-shadow: var(--ui-shadow-25);
  cursor: pointer;
}

.slider-root::after {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  top: 0;
  left: 0;
  content: '';
  z-index: 1;
  position: absolute;
  pointer-events: none;
}

.slider-root::before {
  width: 100%;
  height: 1px;
  background: var(--ui-40);
  opacity: 0.5;
  position: absolute;
  content: '';
  top: 50%;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.slider-root:active,
.slider-root:hover {
  box-shadow: var(--ui-shadow-primary);
}

.slider-root:hover::after {
  background: var(--ui-primary-20);
}

@media (prefers-color-scheme: dark) {
  .slider-root {
    background: var(--ui-90);
  }

  .slider-root::before {
    background: var(--ui-90);
  }
}

.slider-root[data-orientation='vertical'] {
  flex-direction: column;
  height: 100px;
}

.slider-track {
  position: relative;
  height: calc(100% - 40px);
}

.slider-track[data-orientation='vertical'] {
  width: 2px;
}

.slider-thumb {
  display: block;
  width: 20px;
  height: 20px;
  background: var(--ui-100);
  box-shadow: 0 0 0 2px var(--ui-0);
  border-radius: 10px;
  z-index: 2;
  outline: initial;
}

.slider-thumb:hover {
  box-shadow: var(--ui-shadow-primary);
  background: var(--ui-primary-100);

}
</style>
