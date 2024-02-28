<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import { boxStyle } from 'nodenoggin/spatial';
import { useCurrentSpatialView } from '..';

const view = useCurrentSpatialView()

const group = computed(() =>
  boxStyle(view.interaction().canvasToScreen(view.selection.group))
)

const highlight = computed((): [boolean, HTMLAttributes['style']] => {
  const box = view.interaction().normalise(view.selection.box)
  return [
    view.canvas().isTool('select', 'new'),
    boxStyle(box)
  ]
})
</script>

<template>
  <div v-if="view.selection.nodes.length" role="presentation" class="selection-group" :style="group"
    :data-label="`${view.selection.nodes.length}`" />
  <div v-if="highlight[0]" role="presentation" :class="{
    [view.action.tool]: true,
    'selection-box': true,
    active: highlight[0]
  }" :style="highlight[1]" />
</template>

<style scoped>
.selection-group {
  position: absolute;
  z-index: 100;
  box-shadow: var(--ui-shadow-primary);
  top: 0;
  left: 0;
  border-radius: var(--ui-radius);
  transform-origin: 0% 0%;
  display: flex;
  align-items: center;
  pointer-events: none;
}


div.selection-box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  transform-origin: 0% 0%;
  pointer-events: none;
  user-select: none;
  opacity: 0;
}

div.selection-box.active.select {
  /* border: 1px solid var(--ui-primary-100); */
  background: var(--ui-primary-20);
}

div.selection-box.active.new {
  background: var(--color-neutral);
  border-radius: var(--ui-radius);
  box-shadow: 0 0 0 var(--ui-weight) hsla(var(--mono-base-hue), 8%, 50%, 0.25);
}

div.selection-box.active {
  opacity: 1;
}
</style>