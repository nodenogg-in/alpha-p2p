<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { boxFromElement } from '@figureland/mathkit/style'
import BackgroundPattern from './components/BackgroundPattern.vue'
import { useApp } from '@/state'
import { useCurrentSpatialView } from '.'
import { useSubscribable } from '@figureland/statekit/vue'
import { staticCanvasStyle } from '@figureland/infinitykit'
import { storeToRefs } from 'pinia'

const app = useApp()
const view = useCurrentSpatialView()

const element = ref<HTMLElement>()
const { x, y, width, height } = useElementBounding(element)

const resize = () => {
  if (element.value) {
    view.infinitykit.canvas.resize(boxFromElement(element.value))
  }
}

watch([x, y, width, height], resize)
onMounted(resize)

const cssVariables = useSubscribable(view.cssVariables)

const { canvasOptions } = storeToRefs(view)
</script>

<template>
  <section v-bind="$attrs" :class="{
    container: true,
    dragging: app.filedrop.active,
    [view.activeTool]: true,
    // hover: !!view.action.selection.target,
    // [view.action.edge]: true,
    ui: true,
    active: app.pointer.active
  }" :style="cssVariables" role=" presentation" ref="element" @wheel.prevent="view.interaction.onWheel"
    @focusin="view.interaction.onFocusIn" @focusout="view.interaction.onFocusOut"
    @scroll.prevent="view.interaction.onScroll" @pointerdown.prevent.self="view.interaction.onPointerDown"
    @pointerup.prevent.self="view.interaction.onPointerUp" @pointerout.prevent.self="view.interaction.onPointerOut"
    @pointerover.prevent.self="view.interaction.onPointerOver" tabindex="0">
    <BackgroundPattern v-if="canvasOptions.background" />
    <div class="canvas-surface" :style="staticCanvasStyle">
      <slot></slot>
    </div>
    <!-- <Selection v-if="view.action.selection" /> -->
  </section>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  margin: 0;
  outline: initial;
  top: 0;
  left: 0;
}

.container.dragging::after {
  border: var(--ui-weight) solid var(--ui-primary-100);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  content: '';
}

.container:active {
  outline: initial;
}

.container.move {
  cursor: grab;
}

.container.move.active {
  cursor: grabbing;
}

.container.new {
  cursor: crosshair;
}

.container.hover {
  cursor: pointer;
}

.canvas-surface {
  pointer-events: none;
  touch-action: none;
  user-select: none;
}

.container.bottom,
.container.top {
  cursor: ns-resize;
}

.container.bottom-right,
.container.top-left {
  cursor: nwse-resize;
}

.container.bottom-left,
.container.top-right {
  cursor: nesw-resize;
}

.container.left,
.container.right {
  cursor: ew-resize;
}
</style>
