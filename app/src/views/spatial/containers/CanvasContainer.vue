<script setup lang="ts">
import { ref, type PropType, watchEffect } from 'vue'
import { useDropZone, useElementSize } from '@vueuse/core'
import { VALID_MIME_TYPES } from 'nodenoggin-core/utils';
import { setSpatialCSSVariables, type BackgroundPatternType, type Box, type Transform, Tool } from 'nodenoggin-core/canvas';

import { ContextMenu, ContextMenuItem } from '@/components/context-menu'
import BackgroundPattern from '../components/BackgroundPattern.vue';
import { usePointer } from '@/state';
import ColorSelector from '@/components/ColorSelector.vue';
import Selection from '../components/Selection.vue';

const emit = defineEmits<{
    (e: 'onPointerDown', event: PointerEvent): void
    (e: 'onPointerUp', event: PointerEvent): void
    (e: 'onWheel', event: WheelEvent): void
    (e: 'onFocus', event: FocusEvent): void
    (e: 'onDropFiles', results: File[]): void
    (e: 'onResize', size: Box): void
}>()

const props = defineProps({
    transform: {
        type: Object as PropType<Transform>,
        required: true
    },
    tool: {
        type: String as PropType<Tool>,
        default: Tool.Select
    },
    background: {
        type: String as PropType<BackgroundPatternType>
    }
})

const element = ref<HTMLElement>()
const { width, height } = useElementSize(element)

watchEffect(() => {
    if (element.value) {
        setSpatialCSSVariables(element.value, props.transform)
        const { top: y, left: x } = element.value.getBoundingClientRect()
        emit('onResize', { x, y, width: width.value, height: height.value })
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

const { isOverDropZone } = useDropZone(element, {
    onDrop: (files) => files ? emit('onDropFiles', files) : null,
    dataTypes: VALID_MIME_TYPES
})

const pointer = usePointer()

</script>

<template>
    <ContextMenu>
        <section :class="{
            container: true,
            ['drop-active']: isOverDropZone,
            [props.tool]: true,
            active: pointer.active
        }" role="presentation" ref="element" tabindex="0" @wheel.prevent="onScroll" @focusin="onFocus"
            @pointerdown="onPointerDown" @pointerup.prevent.self="onPointerUp">
            <BackgroundPattern v-if="props.background" />
            <div class="canvas-surface" role="presentation">
                <section class="canvas-background">
                    <slot></slot>
                </section>
            </div>
            <Selection />
        </section>
        <template v-slot:menu>
            <ColorSelector :value="'neutral'" :on-update="console.log" />
            <ContextMenuItem value="copy" title="Copy" @click="console.log" />
            <ContextMenuItem value="cut" title="Cut" @click="console.log" />
            <ContextMenuItem value="share" title="Duplicate" @click="console.log" />
            <ContextMenuItem value="copy-link" title="Copy link" @click="console.log" />
        </template>
    </ContextMenu>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    box-sizing: border-box !important;
    background: white;
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

.container::after {
    width: 100%;
    height: 100%;
    content: 'Add files';
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    position: absolute;
    z-index: 100;
    opacity: 0;
}

.container.drop-active::after {
    pointer-events: initial;
    opacity: 1;
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
    transform: translate(var(--spatial-view-translate-x), var(--spatial-view-translate-y)) scale(var(--spatial-view-scale));
}

.canvas-background {
    width: 100%;
    height: 100%;
    position: absolute;
}
</style>