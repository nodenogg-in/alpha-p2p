<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'radix-vue'
import { computed } from 'vue'

import { ZOOM_INCREMENT, MIN_ZOOM, MAX_ZOOM } from 'nodenoggin-core/views/canvas'
import { useCurrentSpatialView } from '@/views/spatial'
import Tooltip from './Tooltip.vue';

const view = useCurrentSpatialView()

const scale = computed(() => [view.canvas.state.transform.scale])

const handleChange = (n?: number[]) => {
  if (n) {
    view.canvas.zoom(n[0])
  }
}

const tooltip = computed(() =>
  `Zoom ${Math.round(view.canvas.state.transform.scale * 100)}%`
)
</script>
<template>
  <Tooltip :tooltip="tooltip" side="left" disableClosingTrigger>
    <SliderRoot @update:modelValue="handleChange" :model-value="scale" class="slider-root" :max="MAX_ZOOM" :min="MIN_ZOOM"
      orientation="vertical" :step="ZOOM_INCREMENT">
      <SliderTrack class="slider-track">
        <SliderRange class="slider-range"> </SliderRange>
      </SliderTrack>
      <SliderThumb class="slider-thumb" aria-label="Zoom canvas" />
    </SliderRoot>
  </Tooltip>
</template>

<style>
.slider-root {
  position: absolute;
  display: flex;
  align-items: center;
  touch-action: none;
  z-index: 50000;
  width: var(--size-24);
  bottom: var(--size-16);
  right: var(--size-16);
  border-radius: var(--size-12);
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

.slider-root:focus-within,
.slider-root:active,
.slider-root:hover {
  box-shadow: var(--ui-shadow-primary);
}

.slider-root:focus-within::after,
.slider-root:hover::after {
  background: var(--ui-primary-20);
}


.slider-root[data-orientation='vertical'] {
  flex-direction: column;
  height: 100px;
}

.slider-track {
  position: relative;
  height: calc(100% - var(--size-48));
}

.slider-track[data-orientation='vertical'] {
  width: 100%;
  height: 100%;
  position: relative;
}

.slider-track::after,
.slider-track::before {
  font-size: var(--size-16);
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  z-index: 1;
  color: var(--ui-40)
}

.slider-track::before {
  top: 0;
  content: '+';
}

.slider-track::after {
  bottom: 0;
  content: '–';
}


.slider-thumb {
  display: block;
  width: var(--size-24);
  height: var(--size-24);
  background: var(--ui-100);
  box-shadow: 0 0 0 var(--ui-weight) var(--ui-0);
  border-radius: var(--size-12);
  z-index: 2;
  outline: initial;
}

.slider-root:focus-within>.slider-thumb,
.slider-thumb:hover {
  box-shadow: var(--ui-shadow-primary);
  background: var(--ui-primary-100);
}

@media (prefers-color-scheme: dark) {
  .slider-thumb {
    background: var(--ui-90);
  }
}
</style>