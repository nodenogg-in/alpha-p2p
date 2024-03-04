<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import { boxStyle } from 'nodenoggin/spatial';
import { useCurrentSpatialView } from '..';

const view = useCurrentSpatialView()

const highlight = computed((): [boolean, HTMLAttributes['style']] => {
  return [
    ['select', 'new'].includes(view.action.tool),
    boxStyle(view.highlight.box.screen)
  ]
})

const group = computed(() => boxStyle(view.selectionGroup.screen))

</script>

<template>
  <div v-if="view.selection.nodes.length" role="presentation"
    :class="{ 'selection-group': true, [view.action.edge]: true }" :style="group"
    :data-label="`${view.selection.nodes.length}`">
  </div>
  <div v-if="view.action.state === 'draw-highlight'" role="presentation" :class="{
    [view.action.tool]: true,
    'selection-box': true,
    active: highlight[0]
  }" :style="highlight[1]" />
</template>

<style scoped>
.selection-group {
  position: absolute;
  z-index: 100;
  box-shadow: 0 0 0 var(--ui-weight) var(--ui-primary-100);
  top: 0;
  left: 0;
  border-radius: var(--ui-radius);
  transform-origin: 0% 0%;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.selection-group::after {
  position: absolute;
  background: var(--ui-primary-100);
  box-shadow: 0 0 0 2px var(--ui-100);
  border-radius: var(--size-4);
  content: '';
  width: var(--size-8);
  height: var(--size-8);
}

.selection-group:not(.none)::before,
.selection-group:not(.none)::after {
  opacity: 1.0;
}

.selection-group.top-left::after {
  top: calc(-1 * var(--size-4));
  left: calc(-1 * var(--size-4));
}

.selection-group.top-right::after {
  top: calc(-1 * var(--size-4));
  right: calc(-1 * var(--size-4));
}

.selection-group.bottom-left::after {
  bottom: calc(-1 * var(--size-4));
  left: calc(-1 * var(--size-4));
}

.selection-group.bottom-right::after {
  bottom: calc(-1 * var(--size-4));
  right: calc(-1 * var(--size-4));
}

.selection-group::before {
  position: absolute;
  background: var(--ui-primary-100);
  box-shadow: 0 0 0 2px var(--ui-100);
  border-radius: var(--size-2);
  content: '';
}

.selection-group.top::before {
  top: calc(-1 * var(--size-4));
  left: calc(50% - var(--size-16));
  width: var(--size-32);
  height: var(--size-4);
}

.selection-group.right::before {
  right: calc(-1 * var(--size-4));
  top: calc(50% - var(--size-16));
  width: var(--size-4);
  height: var(--size-32);
}

.selection-group.bottom::before {
  bottom: calc(-1 * var(--size-4));
  left: calc(50% - var(--size-16));
  width: var(--size-32);
  height: var(--size-4);
}

.selection-group.left::before {
  left: calc(-1 * var(--size-4));
  top: calc(50% - var(--size-16));
  width: var(--size-4);
  height: var(--size-32);
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