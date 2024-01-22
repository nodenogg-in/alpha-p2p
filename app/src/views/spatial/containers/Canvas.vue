<script setup lang="ts">
import { ref, type PropType, nextTick, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { useCurrentView } from '../stores/use-spatial-view'
import { useCursor } from '../stores/use-cursor'
import { calculateFitView, calculateZoom, calculateTranslation, updateTranslation, transformBox, createBoxFromDOMRect, translatePoint } from '../utils/interaction'
import type { Box } from '../types'
import { useElementSize } from '@vueuse/core';
import ZoomControls from '@/views/spatial/components/ZoomControls.vue';
import { isMoveTool, isSelectTool, useApp } from '@/stores/use-app';
import { parseFileToHTMLString } from '@/utils/parse-file';
import { isString } from '@/utils';
import SelectionBox from '../components/SelectionBox.vue';
import SelectionBoxDebug from '../components/SelectionBoxDebug.vue';
import ZoomPanWrapper from './ZoomPanWrapper.vue'
import { CANVAS_HEIGHT, CANVAS_WIDTH, MIN_ZOOM, MAX_ZOOM } from '../constants';
import Minimap from '../components/Minimap.vue';
import Debug from '../components/Debug.vue'
import DebugBox from '../components/Box.vue'
import Indicator from '../components/Indicator.vue'

const emit = defineEmits<{
    (e: 'files-dropped', results: string[]): void
}>()

const app = useApp()
const view = useCurrentView()
const cursor = useCursor()

let animationFrameId: number;

const props = defineProps({
    trackpadPan: {
        type: Boolean
    },
    fitView: {
        type: (Boolean || String) as PropType<boolean | 'resize'>,
        default: false
    },
    disableSelection: {
        type: Boolean
    },
    pannable: {
        type: Boolean
    },
    fixedZoom: {
        type: Boolean
    },
    toggle: {
        type: Boolean
    }
})

const graphDOMElement = ref<HTMLElement | null>()


// Reactive variables
// let initialDistance = 0;
// let initialScale = 1;
// const selecting = ref(false)
// let creating = ref(false);
let isMovable = ref(false);
let pinching = ref(false);
let initialFit = ref(false);


const transform = () => {
    if (cursor.tracking) {
        const { x, y, scale } = calculateFitView(view.dimensions, {
            x: 0,
            y: 0,
            height: view.canvas.height,
            width: view.canvas.height
        });

        if (x !== null && y !== null && scale !== null) {
            view.setTransform({
                scale,
                translate: {
                    x,
                    y
                }
            })
        }
    }
}

async function fitIntoView() {
    await nextTick();
    cursor.tracking = true
    transform()
    cursor.tracking = false
    initialFit.value = true;
}

const updateDimensions = () => {
    if (!graphDOMElement.value) {
        return
    }
    view.dimensions = createBoxFromDOMRect(graphDOMElement.value)

    if (props.fitView === 'resize') {
        fitIntoView();
    }
}

const onMouseUp = () => {
    cursor.finishAction()
    view.finishAction()
}

// const translateAtStart = ref<Transform>({ scale: 1, translate: { x: 0, y: 0 } })

const onMouseDown = (e: MouseEvent) => {
    if (e.button === 2) {
        return
    }

    graphDOMElement.value?.focus();
    view.startAction()
    cursor.startAction()
}

function onTouchStart(e: TouchEvent) {
    if (isMoveTool(app.tool)) {
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

    isMovable.value = false;
    pinching.value = false;
}

const startPinching = () => {
    if (!pinching.value) {
        pinching.value = true;
        animationFrameId = requestAnimationFrame(handlePinch);
    }
}

const handlePinch = () => {
    if (!pinching.value) {
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
    if (props.fixedZoom) return;
    const multiplier = e.shiftKey ? 0.15 : 1;
    const { clientX, clientY, deltaY } = e;
    const currentTranslation = view.transform.translate;
    const pointerPosition = { x: clientX, y: clientY };

    // Check if deltaY has decimal places
    // If it does, it means the user is using a trackpad
    // If trackpadPan is enabled or the meta key is pressed
    // Pan the graph instead of zooming
    if ((!isMoveTool(app.tool) || e.metaKey) && deltaY % 1 === 0) {
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
    const newScale = calculateZoom(view.transform.scale, Math.sign(deltaY), scrollAdjustment);

    // Calculate the translation adjustment
    const newTranslation = calculateTranslation(
        view.transform.scale,
        newScale,
        currentTranslation,
        pointerPosition,
        view.dimensions
    );

    // Apply transforms
    view.setTransform({
        scale: newScale,
        translate: newTranslation
    })
}

const handleZoomControl = (newScale: number) => {
    // Calculate the translation adjustment
    const newTranslation = calculateTranslation(
        view.transform.scale,
        newScale,
        view.transform.translate,
        {
            x: view.dimensions.width / 2,
            y: view.dimensions.height / 2
        },
        view.dimensions
    );

    // Apply transforms
    view.setTransform({
        scale: newScale,
        translate: newTranslation
    })
}

const render = () => {
    if (cursor.tracking && isMoveTool(app.tool)) {
        view.setTransform({
            translate: updateTranslation(cursor.delta, view.previousTransform)
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

    if (props.fitView === 'resize') {
        fitIntoView();
    }
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

const selection = computed((): Box => ({
    x: cursor.selectionBox.x - view.dimensions.x,
    y: cursor.selectionBox.y - view.dimensions.y,
    width: cursor.selectionBox.width,
    height: cursor.selectionBox.height
}))

const selectionAdjusted = computed((): Box => {
    return transformBox(cursor.selectionBox, view.transform, view.dimensions)
})


const onDrop = (e: DragEvent) => {
    if (e.dataTransfer) {
        setInactive()
        // open.value = true
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
        [app.tool]: true
    }" @wheel.prevent="handleScroll" @dragenter.prevent="setActive" @dragover.prevent="setActive"
        @dragleave.prevent="setInactive" @drop.prevent="onDrop" @mousedown.prevent.self="onMouseDown"
        @touchend.prevent="onTouchEnd" @touchstart.prevent.self="onTouchStart" ref="graphDOMElement" tabindex="0"
        @mouseup.prevent.self="onMouseUp">
        <ZoomPanWrapper>
            <section class="inner"
                :style="{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px`, left: `${-CANVAS_WIDTH / 2}px`, top: `${-CANVAS_HEIGHT / 2}px` }">
                <slot></slot>
                <DebugBox color="red" :box="{
                    width: 200,
                    height: 200,
                    x: 0,
                    y: 0
                }" />
                <DebugBox color="blue" :box="{
                    width: 200,
                    height: 200,
                    x: view.canvas.width - 200,
                    y: 0
                }" />
                <DebugBox color="orange" :box="{
                    width: 200,
                    height: 200,
                    x: view.canvas.width - 200,
                    y: view.canvas.height - 200
                }" />
                <DebugBox color="yellow" :box="{
                    width: 200,
                    height: 200,
                    x: 0,
                    y: view.canvas.height - 200
                }" />
                <DebugBox color="green" :box="{
                    width: view.dimensions.width,
                    height: view.dimensions.height,
                    x: (view.canvas.height / 2) - (view.dimensions.width / 2),
                    y: (view.canvas.width / 2) - (view.dimensions.height / 2)
                }" />
            </section>
            <SelectionBoxDebug :box="selectionAdjusted" :active="isSelectTool(app.tool)" />
            <Indicator :position="translatePoint(cursor.touchPoint, view.transform, view.dimensions)" />
        </ZoomPanWrapper>
        {{ dropActive }}
        <Indicator outline :position="{
            x: cursor.touchPoint.x - view.dimensions.x,
            y: cursor.touchPoint.y - view.dimensions.y
        }" />
        <SelectionBox :box="selection" :active="isSelectTool(app.tool)" />
        <ZoomControls :value="view.transform.scale" :onChange="handleZoomControl" label="Zoom" />
        <Minimap />
        <Debug />
    </section>
</template>

<style scoped>
.inner {
    box-shadow: 0 0 0 2px orange;
    position: absolute;
    background-image: radial-gradient(rgb(150, 150, 150) 1px, rgba(150, 150, 150, 0.0) 1px);
    background-size: 20px 20px;
}


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
    y: 0;
    x: 0;
    position: absolute;
    z-index: 100;
    opacity: 0.0;
}

.container.drop-active::after {
    pointer-events: initial;
    opacity: 1.0;
}
</style>