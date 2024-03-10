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
    :data-label="`${view.selection.nodes.length}`" />
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
  --handle: var(--size-12);
}


.selection-group::before {
  content: '';
  width: var(--handle);
  height: var(--handle);
  background: var(--ui-primary-100);
  opacity: 0.0;
  position: absolute;
  border-radius: var(--ui-radius);
  box-shadow: 0 0 0 2px var(--ui-100);
}

.selection-group.top::before,
.selection-group.bottom::before,
.selection-group.left::before,
.selection-group.right::before,
.selection-group.bottom-right::before,
.selection-group.bottom-left::before,
.selection-group.top-right::before,
.selection-group.top-left::before {
  opacity: 1;
}

.selection-group.top::before {
  top: calc(-0.5 * var(--handle) - 1px);
  left: calc(50% - 1 * var(--handle));
  width: calc(2 * var(--handle));
}

.selection-group.bottom::before {
  bottom: calc(-0.5 * var(--handle) - 1px);
  left: calc(50% - 1 * var(--handle));
  width: calc(2 * var(--handle));
}

.selection-group.left::before {
  top: calc(50% - 1 * var(--handle));
  left: calc(-0.5 * var(--handle) - 1px);
  height: calc(2 * var(--handle));
}

.selection-group.right::before {
  top: calc(50% - 0.5 * var(--handle));
  right: calc(-0.5 * var(--handle) - 1px);
  height: calc(2 * var(--handle));
}

.selection-group.bottom-right::before {
  bottom: calc(-0.5 * var(--handle));
  right: calc(-0.5* var(--handle));
}

.selection-group.bottom-left::before {
  bottom: calc(-0.5 * var(--handle));
  left: calc(-0.5 * var(--handle));
}

.selection-group.top-right::before {
  top: calc(-0.5 * var(--handle));
  right: calc(-0.5 * var(--handle));
}

.selection-group.top-left::before {
  top: calc(-0.5 * var(--handle));
  left: calc(-0.5 * var(--handle));
}

/* .bottom-right::after {
  transform-origin: 
}

svg.resize-corner.top-right {
  top: -16px;
  right: -16px;
  opacity: 1.0;
  transform: rotate(-90deg);
}

svg.resize-corner.top-left {
  top: -16px;
  left: -16px;
  opacity: 1.0;
  transform: rotate(180deg);
}

svg.resize-corner.bottom-left {
  bottom: -16px;
  left: -16px;
  opacity: 1.0;
  transform: rotate(90deg);
} */


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