<script setup lang="ts">
import type { HTMLAttributes, PropType } from 'vue'
import { icons } from './svg'
import type { IconName } from './svg'

defineProps({
  size: {
    type: Number,
    default: 32
  },
  type: {
    type: String,
    required: true
  },
  style: {
    type: Object as PropType<HTMLAttributes['style']>
  }
})
</script>

<template>
  <svg
    class="icon"
    v-bind="$attrs"
    :width="size"
    :height="size"
    :style="style"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
    v-if="!!icons[type as IconName]"
    v-html="icons[type as IconName]"
  ></svg>
</template>

<style scoped>
svg.icon {
  fill: none;
  transform-origin: 50% 50%;
}

svg.icon > :global(path) {
  fill: currentColor;
}
</style>
