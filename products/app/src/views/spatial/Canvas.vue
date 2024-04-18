<script setup lang="ts">
import { ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { boxFromElement } from '@figureland/mathkit/style'
import BackgroundPattern from './components/BackgroundPattern.vue'
import Selection from './components/Selection.vue'
import { app as nnApp, useApp } from '@/state'
import { useCurrentSpatialView } from '.'
import { useSubscribable } from '@figureland/statekit/vue'

const app = useApp()
const spatial = useCurrentSpatialView()

const element = ref<HTMLElement>()
const { width, height } = useElementSize(element)

watch([width, height], () => {
  if (element.value) {
    spatial.resize(boxFromElement(element.value))
  }
})

const dragging = useSubscribable(nnApp.filedrop.key('active'))
</script>

<template>
  <section v-bind="$attrs" :class="{
    container: true,
    dragging,
    [spatial.action.tool]: true,
    hover: !!spatial.action.selection.target,
    [spatial.action.edge]: true,
    ui: true,
    active: app.pointer.active
  }" :style="spatial.styles.container" role=" presentation" ref="element" tabindex="0" @wheel.prevent="spatial.onWheel"
    @focusin="spatial.onFocus" @pointerdown.prevent.self="spatial.onPointerDown"
    @pointerup.prevent.self="spatial.onPointerUp" @pointerout.prevent.self="spatial.onPointerOut"
    @pointerover.prevent.self="spatial.onPointerOver">
    <BackgroundPattern v-if="spatial.state.background" :state="spatial.state" :transform="spatial.transform" />
    <div class="canvas-surface" :style="spatial.styles.canvas">
      <slot></slot>
    </div>
    <Selection v-if="spatial.action.selection" />
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
