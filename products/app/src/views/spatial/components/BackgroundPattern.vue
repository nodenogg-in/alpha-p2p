<script setup lang="ts">
import { useCurrentSpatialView } from '..'
// import { useSubscribable } from '@figureland/statekit/vue';
import { storeToRefs } from 'pinia';
import { useSubscribable } from '@figureland/statekit/vue';


const view = useCurrentSpatialView()
const pattern = useSubscribable(view.infinitykit.backgroundPattern)

const { canvasOptions } = storeToRefs(view)
</script>

<template>
  <svg role="presentation">
    <g v-if="canvasOptions.background !== 'none'">
      <defs>
        <pattern :id="view.view_id" v-bind="pattern">
          <g v-if="canvasOptions.background === 'dots'">
            <circle cx="1" cy="1" r="1" />
          </g>
          <g v-else>
            <line x1="0" y1="0" :x2="pattern.width" y2="0" />
            <line x1="0" y1="0" x2="0" :y2="pattern.width" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" :fill="`url(#${view.view_id})`" :style="`opacity: ${pattern.opacity};`" />
    </g>
  </svg>
</template>

<style scoped>
svg {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: var(--ui-100);
}

line {
  stroke-width: 3px;
  stroke: var(--ui-90);
}

circle {
  fill: var(--ui-80);
}

@media (prefers-color-scheme: dark) {
  circle {
    fill: var(--ui-70);
  }

  line {
    stroke: var(--ui-90);
  }
}
</style>
