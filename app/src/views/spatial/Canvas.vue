<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDropZone, useElementSize } from '@vueuse/core'
import { getElementBox } from 'nodenoggin/spatial';
import { VALID_MIME_TYPES } from 'nodenoggin/utils';

import BackgroundPattern from './components/BackgroundPattern.vue';
import Selection from './components/Selection.vue';
import { useApp } from '@/state';
import { useCurrentSpatialView } from '.';

const app = useApp()
const spatial = useCurrentSpatialView()

const element = ref<HTMLElement>()
const { width, height } = useElementSize(element)

watch([width, height], () => {
    if (element.value) {
        spatial.resize(getElementBox(element.value))
    }
})

const { isOverDropZone } = useDropZone(element, {
    onDrop: spatial.onDropFiles,
    dataTypes: VALID_MIME_TYPES
})


</script>

<template>
    <section v-bind="$attrs" :class="{
        container: true,
        [spatial.action.tool]: true,
        hover: !!spatial.selection.target,
        [spatial.action.edge]: true,
        ui: true,
        'drop-active': isOverDropZone,
        active: app.pointer.active
    }" :style="spatial.cssVariables" role=" presentation" ref="element" tabindex="0" @wheel.prevent="spatial.onWheel"
        @focusin="spatial.onFocus" @pointerdown.prevent.self="spatial.onPointerDown"
        @pointerup.prevent.self="spatial.onPointerUp" @pointerout.prevent.self="spatial.onPointerOut"
        @pointerover.prevent.self="spatial.onPointerOver">
        <BackgroundPattern v-if="spatial.state.background" :state="spatial.state" />
        <div class="canvas-surface">
            <section class="canvas-background">
                <slot></slot>
            </section>
        </div>
        <Selection v-if="spatial.selection" />
    </section>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    box-sizing: border-box !important;
    margin: 0;
    outline: initial;
}

.container::after {
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: var(--ui-90);
    opacity: 0.0;
    z-index: 1;
}

.container.drop-active::after {
    opacity: 0.3;
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
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform-origin: 50% 50%;
    touch-action: none;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    transform: var(--spatial-view-transform);
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

.canvas-background {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
}
</style>