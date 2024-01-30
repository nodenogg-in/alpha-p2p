<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import { isNewTool, isSelectTool, useCurrentSpatialView } from '@/views/spatial'

const view = useCurrentSpatialView()

const group = computed(() => {
  const box = view.canvasToScreen(view.selection.selection.group)
  return {
    width: `${box.width}px`,
    height: `${box.height}px`,
    transform: `translate(${box.x}px, ${box.y}px)`
  }
})

const highlight = computed((): [boolean, HTMLAttributes['style']] => {
  const box = view.normalise(view.selection.area)
  return [
    isSelectTool(view.tool) || isNewTool(view.tool),
    {
      width: `${box.width + 1}px`,
      height: `${box.height + 1}px`,
      transform: `scale(1.0) translate(${box.x}px, ${box.y}px)`
    }
  ]
})

</script>

<template>
  <div v-if="view.selection.selection.nodes.length" role="presentation" class="selection-group" :style="group"
    :data-label="`${view.selection.selection.nodes.length}`" />
  <div v-if="highlight[0]" role="presentation" :class="{
    [view.tool]: true,
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
  box-shadow: var(--ui-card-shadow);
}

div.selection-box.active {
  opacity: 1;
}
</style>
