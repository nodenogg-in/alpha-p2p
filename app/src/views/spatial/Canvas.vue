<script setup lang="ts">
import { ref, type PropType, computed, watch } from 'vue'
import { useDropZone, useElementSize } from '@vueuse/core'
import { getSpatialCSSVariables, Tool, type CanvasState, getElementBox } from 'nodenoggin/spatial';
import type { Box } from 'nodenoggin/schema';

import BackgroundPattern from './components/BackgroundPattern.vue';
import Selection from './components/Selection.vue';
import { VALID_MIME_TYPES } from 'nodenoggin';

const emit = defineEmits<{
    (e: 'onPointerDown', event: PointerEvent): void
    (e: 'onPointerUp', event: PointerEvent): void
    (e: 'onPointerOut', event: PointerEvent): void
    (e: 'onPointerOver', event: PointerEvent): void
    (e: 'onWheel', event: WheelEvent): void
    (e: 'onFocus', event: FocusEvent): void
    (e: 'onResize', size: Box): void
    (e: 'onDropFiles', files: File[]): void
}>()

const props = defineProps({
    active: {
        type: Boolean,
        required: true
    },
    state: {
        type: Object as PropType<CanvasState>,
        required: true
    },
    tool: {
        type: String as PropType<Tool>,
        default: Tool.Select
    },
    selection: {
        type: Boolean,
        default: true
    },
    hover: {
        type: Boolean,
    }
})

const element = ref<HTMLElement>()
const { width, height } = useElementSize(element)

watch([width, height], () => {
    if (element.value) {
        emit('onResize', getElementBox(element.value))
    }
})


const { isOverDropZone } = useDropZone(element, {
    onDrop: (files) => {
        if (files) {
            emit('onDropFiles', files)
        }
    },
    dataTypes: VALID_MIME_TYPES
})



const onFocus = (event: FocusEvent) =>
    emit('onFocus', event)

const onPointerDown = (e: PointerEvent) =>
    emit('onPointerDown', e)

const onPointerOut = (e: PointerEvent) =>
    emit('onPointerOut', e)

const onPointerUp = (e: PointerEvent) =>
    emit('onPointerUp', e)

const onPointerOver = (e: PointerEvent) =>
    emit('onPointerOver', e)

const onScroll = (e: WheelEvent) =>
    emit('onWheel', e)

const style = computed(() => getSpatialCSSVariables(props.state))
</script>

<template>
    <section v-bind="$attrs" :class="{
        container: true,
        [tool]: true,
        hover,
        ui: true,
        'drop-active': isOverDropZone,
        active: props.active
    }" :style="style" role=" presentation" ref="element" tabindex="0" @wheel.prevent="onScroll" @focusin="onFocus"
        @pointerdown.prevent.self="onPointerDown" @pointerup.prevent.self="onPointerUp"
        @pointerout.prevent.self="onPointerOut" @pointerover.prevent.self="onPointerOver">
        <BackgroundPattern v-if="state.background" :state="state" />
        <div class="canvas-surface">
            <section class="canvas-background">
                <slot></slot>
            </section>
        </div>
        <Selection v-if="selection" />
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
    pointer-events: none;
    transform: var(--spatial-view-transform);
}

.canvas-background {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
}
</style>