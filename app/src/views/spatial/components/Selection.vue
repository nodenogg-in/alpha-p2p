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
  <div v-if="view.selection.nodes.length" role="presentation" :class="{ 'selection-group': true }" :style="group"
    :data-label="`${view.selection.nodes.length}`">
    <svg :class="{ 'resize-corner': true, [view.action.edge]: true }" width="21" height="21" viewBox="0 0 21 21"
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.9382 2.19967C18.9382 11.0362 11.7748 18.1997 2.93823 18.1997" />
    </svg>

    <svg :class="{ 'resize-edge': true, [view.action.edge]: true }" width="5" height="36" viewBox="0 0 5 37" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M2.6731 2.97485V34.9749" />
    </svg>


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

svg.resize-corner {
  position: absolute;
  opacity: 0.0;
}

svg.resize-corner.none {
  opacity: 0.0;
}

svg.resize-corner.bottom-right {
  bottom: -16px;
  right: -16px;
  opacity: 1.0;
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
}

svg.resize-corner>path {
  fill: none;
  stroke: var(--ui-primary-100);
  stroke-width: 4px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

svg.resize-edge {
  position: absolute;
  opacity: 0.0;
}

svg.resize-edge.right {
  right: -16px;
  top: calc(50% - 18px);
  opacity: 1.0;
}

svg.resize-edge.left {
  left: -16px;
  top: calc(50% - 18px);
  opacity: 1.0;
}

svg.resize-edge.top {
  top: -32px;
  left: calc(50% - 2px);
  transform: rotate(90deg);
  opacity: 1.0;
}

svg.resize-edge.bottom {
  bottom: -32px;
  transform: rotate(90deg);
  left: calc(50% - 2px);
  opacity: 1.0;
}

svg.resize-edge>path {
  fill: none;
  stroke: var(--ui-primary-100);
  stroke-width: 4px;
  stroke-linecap: round;
  stroke-linejoin: round;
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