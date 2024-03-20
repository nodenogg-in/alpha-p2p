<script setup lang="ts">
import { useApp } from '@/state'
import type { PropType } from 'vue'

const app = useApp()
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
  <div :class="{ panel: true, inset, 'menu-open': app.state.menuOpen }" :style="{
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
  border-radius: 8px;
  overflow: hidden;
}

.panel.menu-open {
  width: calc(100% - var(--app-menu-width));
  left: var(--app-menu-width);
}

.panel.inset {
  border-radius: var(--ui-radius);
  box-shadow: var(--ui-shadow-100);
  overflow: hidden;
}
</style>