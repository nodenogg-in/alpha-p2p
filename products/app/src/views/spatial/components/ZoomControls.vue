<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { useCurrentSpatialView } from '@/views/spatial'
import Tooltip from '../../../components/Tooltip.vue'
import { storeToRefs } from 'pinia';
import { vue } from '@figureland/kit/state/vue';

const view = useCurrentSpatialView()


const handleChange = (n?: number[]) => {
  if (n) {
    view.infinitykit.canvas.zoom(n[0])
  }
}


const { canvasOptions } = storeToRefs(view)

const scale = vue(view.infinitykit.canvas.scale)

</script>

<template>
  <Tooltip tooltip="Zoom" :command="`${Math.round(scale * 100)}%`" side="left" disableClosingTrigger>
    <SliderRoot @update:modelValue="handleChange" :model-value="[scale]" class="slider-root"
      :max="canvasOptions.zoom.max" :min="canvasOptions.zoom.min" orientation="vertical"
      :step="canvasOptions.zoom.increment">
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
  cursor: pointer;
  background: var(--ui-90);
  box-shadow: var(--ui-container-shadow);
  border-radius: var(--size-16);
  color: var(--ui-60);
}

@media (prefers-color-scheme: dark) {
  .slider-root {
    box-shadow: var(--ui-shadow-25);
  }
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

/* .slider-root:focus-within, */
.slider-root:active,
.slider-root:hover {
  /* box-shadow: var(--ui-shadow-primary); */
}

.slider-root:hover,
.slider-root:focus-within {
  color: var(--ui-primary-100);
}

.slider-root:focus-within::after,
.slider-root:hover::after {
  box-shadow: var(--ui-shadow-primary);
}

.slider-root[data-orientation='vertical'] {
  flex-direction: column;
  height: 120px;
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
  font-size: 1.25em;
  padding: var(--size-4);
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  z-index: 100;
  color: inherit;
  mix-blend-mode: difference;
  pointer-events: none;
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
  background: inherit;
  box-shadow: var(--ui-shadow-100);
  border-radius: var(--size-16);
  z-index: 2;
  outline: initial;
}

.slider-root:focus-within>.slider-thumb,
.slider-thumb:hover {
  box-shadow: 0 0 0 var(--ui-weight) var(--ui-100);
  background: var(--ui-primary-100);
}

@media (prefers-color-scheme: dark) {
  .slider-thumb {
    background: var(--ui-90);
  }
}
</style>
