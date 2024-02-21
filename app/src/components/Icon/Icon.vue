<script setup lang="ts">
import type { HTMLAttributes, PropType } from 'vue'
import * as icons from './svg'
import type { IconName } from './svg'

defineProps({
  size: {
    type: Number,
    default: 32
  },
  type: {
    type: String as PropType<IconName>,
    required: true
  },
  style: {
    type: Object as PropType<HTMLAttributes['style']>
  }
})
</script>

<template>
  <svg v-bind="$attrs" :width="size" :height="size" :style="style" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <component :is="icons[type]" />
  </svg>
</template>

<style scoped>
svg {
  fill: none;
  transform-origin: 50% 50%;
}

svg :global(path) {
  fill: currentColor;
}
</style>
