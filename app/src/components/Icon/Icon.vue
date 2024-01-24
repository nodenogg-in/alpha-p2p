<script setup lang="ts">
import type { PropType } from 'vue'
import * as icons from './svg'
import type { IconName } from './svg'

const props = defineProps({
  size: {
    type: Number,
    default: 40
  },
  type: {
    type: String as PropType<IconName>,
    required: true
  }
})
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
    v-html="icons[props.type]"
  ></svg>
</template>

<style scoped>
svg {
  fill: none;
}

svg :global(path) {
  stroke: currentColor;
}
</style>
