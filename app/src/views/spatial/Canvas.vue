<script setup lang="ts">
import { ref, type PropType, computed, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { getSpatialCSSVariables, Tool, type CanvasState, getElementBox, setSpatialCSSVariables } from 'nodenoggin/spatial';
import type { Box } from 'nodenoggin/schema';

import BackgroundPattern from './components/BackgroundPattern.vue';
import Selection from './components/Selection.vue';

const emit = defineEmits<{
    (e: 'onPointerDown', event: PointerEvent): void
    (e: 'onPointerUp', event: PointerEvent): void
    (e: 'onWheel', event: WheelEvent): void
    (e: 'onFocus', event: FocusEvent): void
    (e: 'onResize', size: Box): void
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
    }
})

const element = ref<HTMLElement>()
const { width, height } = useElementSize(element)

watch([width, height], () => {
    if (element.value) {
        emit('onResize', getElementBox(element.value))
    }
})

const onFocus = (event: FocusEvent) =>
    emit('onFocus', event)

const onPointerDown = (e: PointerEvent) => {
    if (e.button === 2) {
        return
    }

    element.value?.focus()
    emit('onPointerDown', e)
}

const onPointerUp = (e: PointerEvent) =>
    emit('onPointerUp', e)


const onScroll = (e: WheelEvent) =>
    emit('onWheel', e)

// watch(props.state, () => {
//     if (element.value) {

//         setSpatialCSSVariables(element.value, props.state)
//     }
// })
const style = computed(() => getSpatialCSSVariables(props.state))
</script>

<template>
    <section v-bind="$attrs" :class="{
        container: true,
        [tool]: true,
        active: props.active
    }" :style="style" role=" presentation" ref="element" tabindex="0" @wheel.prevent="onScroll" @focusin="onFocus"
        @pointerdown.prevent.self="onPointerDown" @pointerup.prevent.self="onPointerUp">
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

.canvas-background {
    width: 100%;
    height: 100%;
    position: absolute;
}
</style>