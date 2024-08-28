<script setup lang="ts">
import { type PropType } from 'vue'
import { boxStyle } from '@figureland/infinitykit'
import type { Box } from '@figureland/kit/math/box'

defineProps({
  color: {
    type: String,
    default: 'neutral'
  },
  transform: {
    type: Object as PropType<Box>
  },
  active: {
    type: Boolean
  },
  selected: {
    type: Boolean
  },
  hover: {
    type: Boolean
  }
})
</script>

<template>
  <article v-bind="$attrs" tabindex="0" :class="{
    card: true,
    active,
    selected,
    hover,
    spatial: !!transform,
    ui: true,
    [color]: true
  }" :style="transform ? boxStyle(transform) : ''">

    <slot></slot>
  </article>
</template>

<style scoped>
article.card {
  pointer-events: none;
  user-select: none;
  color: var(--ui-10);
  border-radius: var(--card-radius);
  box-shadow: 0 0 0 calc(1px * var(--infinitykit-inverted-scale)) hsla(var(--mono-base-hue), 8%, 20%, 0.0);
}

article.card.selected,
article.card:focus {
  outline: initial;
  box-shadow: 0 0 0 calc(var(--ui-weight) * var(--infinitykit-inverted-scale)) var(--ui-primary-100);
}

article.card.hover {
  box-shadow: 0 0 0 calc(4px * var(--infinitykit-inverted-scale)) var(--ui-primary-100);
}

article.spatial {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0% 0%;
}

article.neutral {
  background: var(--card-neutral-90);
}

article.neutral {
  background: var(--card-turquoise-90);
}

@media (prefers-color-scheme: dark) {
  article.neutral {
    background: var(--card-orange-20);
  }
}

@media (prefers-color-scheme: dark) {
  article.card {
    /* box-shadow: 0 0 0 calc(var(--infinitykit-inverted-scale) * 1px) hsla(var(--mono-base-hue), 8%, 90%, 0.50); */
  }
}

article.card.active {
  z-index: 1000;
  box-shadow: 0 0 0 calc(var(--infinitykit-inverted-scale) * 1px) var(--ui-primary-100);
  pointer-events: initial;
}
</style>
