<script setup lang="ts">
import { type PropType } from 'vue'
import { boxStyle, type Box } from '@figureland/infinitykit'

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
  <article v-bind="$attrs" :class="{
    card: true,
    active,
    selected,
    hover,
    spatial: !!transform,
    ui: true,
    [color]: true
  }" :style="transform ? boxStyle(transform) : ''">
    <!-- <pre>{{ JSON.stringify({ x: transform.x, y: transform.y }, null, 2) }}</pre> -->
    <!-- <pre>
    {{ JSON.stringify(boxStyle(transform, null, 2)) }}
  </pre> -->
    <slot></slot>
  </article>
</template>

<style scoped>
article.card {
  color: var(--ui-10);
  border-radius: var(--card-radius);
  box-shadow: 0 0 0 var(--card-outline) hsla(var(--mono-base-hue), 8%, 20%, 0.15);
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
    background: var(--card-purple-20);
  }
}

@media (prefers-color-scheme: dark) {
  article.card {
    box-shadow: 0 0 0 var(--card-outline) hsla(var(--mono-base-hue), 8%, 90%, 0.15);
  }
}

article.card.active {
  z-index: 1000;
  box-shadow: 0 0 0 calc(var(--card-outline) * 2) var(--ui-primary-100);
  pointer-events: initial;
}

article.card.hover {
  box-shadow: 0 0 0 calc(var(--card-outline) * 2) var(--ui-primary-100);
}

/* article.card:focus, */
article.card.selected {
  outline: initial;
  box-shadow: 0 0 0 calc(var(--card-outline) * 2) var(--ui-primary-100);
}
</style>
