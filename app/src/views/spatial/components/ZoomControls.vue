<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'radix-vue'
import { computed } from 'vue'

import { ZOOM_INCREMENT, MIN_ZOOM, MAX_ZOOM } from '../constants'
import { useCurrentSpatialView } from '../stores/use-spatial-view'

const view = useCurrentSpatialView()

const scale = computed(() => [view.transform.scale])

const handleChange = (n?: number[]) => {
  if (n) {
    view.zoom(n[0])
  }
}
</script>
<template>
  <SliderRoot
    @update:modelValue="handleChange"
    :model-value="scale"
    class="slider-root"
    :max="MAX_ZOOM"
    :min="MIN_ZOOM"
    orientation="vertical"
    :step="ZOOM_INCREMENT"
  >
    <SliderTrack class="slider-track">
      <SliderRange class="slider-range"> </SliderRange>
    </SliderTrack>
    <SliderThumb class="slider-thumb" aria-label="Zoom canvas" />
  </SliderRoot>
</template>

<style>
.slider-root {
  position: absolute;
  background: white;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  touch-action: none;
  z-index: 50000;
  padding: 15px;
  bottom: 150px;
  right: 10px;
  border-radius: 10px;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.slider-root::after {
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.25);
  position: absolute;
  content: '';
  top: 50%;
  left: 0;
  z-index: 0;
}

.slider-root[data-orientation='vertical'] {
  flex-direction: column;
  height: 200px;
}

.slider-track {
  background: rgba(200, 200, 200, 1);
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 3px;
}

.slider-track[data-orientation='vertical'] {
  width: 100%;
}

.slider-thumb {
  display: block;
  width: 20px;
  height: 20px;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  z-index: 2;
}
</style>
