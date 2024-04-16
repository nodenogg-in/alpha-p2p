<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  width: {
    type: String as PropType<string | number>,
    default: '100%'
  },
  height: {
    type: String as PropType<string | number>,
    default: '100%'
  },
  zIndex: {
    type: Number,
    default: 0
  },
  inset: {
    type: Boolean
  }
})
</script>

<template>
  <div :class="{ panel: true, inset }" :style="{
    ...(inset && {
      transform: `translate(${x}px, ${y}px)`,
      zIndex,
      width,
      height
    })
  }">
    <slot></slot>
  </div>
</template>

<style scoped>
.panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.panel.inset {
  box-shadow: var(--ui-shadow-10);
  overflow: hidden;
}
</style>