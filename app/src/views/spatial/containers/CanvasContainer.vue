<script setup lang="ts">
import { ref, watch, onBeforeUnmount, watchEffect } from 'vue'
import { isMoveTool, useCurrentSpatialView } from '../stores/use-spatial-view'
import { useCursor } from '../stores/use-cursor'
import { calculateZoom, calculateTranslation, createBoxFromDOMRect } from '../utils/interaction'
import { useElementSize } from '@vueuse/core';
import { parseFileToHTMLString } from '@/utils/parse-file';
import { isString } from '@/utils';
import { MIN_ZOOM, MAX_ZOOM } from '../constants';

const emit = defineEmits<{
    (e: 'files-dropped', results: string[]): void
}>()

const view = useCurrentSpatialView()
const cursor = useCursor()

let animationFrameId: number;

const graphDOMElement = ref<HTMLElement | null>()

const onMouseUp = () => {
    cursor.finishAction()
    view.finishAction()
}

const onMouseDown = (e: MouseEvent) => {
    if (e.button === 2) {
        return
    }

    graphDOMElement.value?.focus();
    view.startAction()
    cursor.startAction()
}

function onTouchStart(e: TouchEvent) {
    if (isMoveTool(view.tool)) {
        view.startAction()
        cursor.startAction()
    }
    if (e.touches.length === 2) {
        startPinching();
        view.startAction(cursor.touchDistance)
    }
}

const onTouchEnd = () => {
    cursor.finishAction()
    view.finishAction()

    cursor.pinching = false;
}

const startPinching = () => {
    if (!cursor.pinching) {
        cursor.pinching = true;
        animationFrameId = requestAnimationFrame(handlePinch);
    }
}

const handlePinch = () => {
    if (!cursor.pinching) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    const newDistance = cursor.touchDistance;
    const scaleFactor = newDistance / view.previousDistance;
    view.setTransform({
        scale: view.previousTransform.scale * scaleFactor
    })
    animationFrameId = requestAnimationFrame(handlePinch);
}

const handleScroll = (e: WheelEvent) => {
    const multiplier = e.shiftKey ? 0.15 : 1;
    const { clientX, clientY, deltaY } = e;
    const currentTranslation = view.transform.translate;
    const pointerPosition = { x: clientX, y: clientY };

    // Check if deltaY has decimal places
    // If it does, it means the user is using a trackpad
    // If trackpadPan is enabled or the meta key is pressed
    // Pan the graph instead of zooming
    if ((!isMoveTool(view.tool) || e.metaKey) && deltaY % 1 === 0) {
        view.setTransform({
            translate: {
                x: (view.transform.translate.x - e.deltaX),
                y: (view.transform.translate.y - e.deltaY)
            }
        })
        return;
    }

    if ((view.transform.scale >= MAX_ZOOM && deltaY < 0) || (view.transform.scale <= MIN_ZOOM && deltaY > 0)) return;

    // Calculate the scale adjustment
    const scrollAdjustment = Math.min(0.009 * multiplier * Math.abs(deltaY), 0.08);
    const scale = calculateZoom(view.transform.scale, Math.sign(deltaY), scrollAdjustment);

    // Apply transforms
    view.setTransform({
        scale,
        translate: calculateTranslation(
            view.transform.scale,
            scale,
            currentTranslation,
            pointerPosition,
            view.dimensions
        )
    })
}

const render = () => {
    if (view.active && isMoveTool(view.tool)) {
        view.setTransform({
            translate: {
                x: view.previousTransform.translate.x + cursor.delta.x,
                y: view.previousTransform.translate.y + cursor.delta.y,
            }
        })
    }
    animationFrameId = requestAnimationFrame(render);
}

onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId)
})

render()

const { width, height } = useElementSize(graphDOMElement)

watch([width, height], () => {
    if (!graphDOMElement.value) {
        return
    }
    view.setDimensions(createBoxFromDOMRect(graphDOMElement.value))

})

watchEffect(() => {
    view.tool && cursor.finishAction()
})

let inActiveTimeout: ReturnType<typeof setTimeout>

const dropActive = ref(false)

const setActive = () => {
    dropActive.value = true
    clearTimeout(inActiveTimeout)
}

const setInactive = () => {
    inActiveTimeout = setTimeout(() => {
        dropActive.value = false
    }, 50)
}

const onDrop = (e: DragEvent) => {
    if (e.dataTransfer) {
        setInactive()
        const files = [...e.dataTransfer.files]

        Promise.all(files.map(parseFileToHTMLString))
            .then((results) => {
                const htmlStrings = results.filter(isString)
                emit('files-dropped', htmlStrings)
            })
    }
}

</script>

<template>
    <section role="presentation" :class="{
        container: true,
        ['drop-active']: dropActive,
        [view.tool]: true
    }" @wheel.prevent="handleScroll" @dragenter.prevent="setActive" @dragover.prevent="setActive"
        @dragleave.prevent="setInactive" @drop.prevent="onDrop" @mousedown.prevent.self="onMouseDown"
        @touchend.prevent="onTouchEnd" @touchstart.prevent.self="onTouchStart" ref="graphDOMElement" tabindex="0"
        @mouseup.prevent.self="onMouseUp">
        <slot></slot>
    </section>
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
}

.container:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgb(59, 102, 232);
}

.container.move {
    cursor: grab;
}

.container.new {
    cursor: crosshair;
}

.container::after {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.75);
    content: 'Add files';
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    position: absolute;
    z-index: 100;
    opacity: 0.0;
}

.container.drop-active::after {
    pointer-events: initial;
    opacity: 1.0;
}
</style>