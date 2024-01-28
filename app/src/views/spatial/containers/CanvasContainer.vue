<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import {
    isNewTool,
    useCurrentSpatialView
} from '@/views/spatial'
import { usePointer } from '@/views/spatial/stores/use-pointer'
import { parseFileToHTMLString } from '@/utils/parsers/file'
import { isString } from '@/utils'
import ContextMenuVue from '@/components/ContextMenu.vue'
import type { ContextMenuOption } from '@/components/ContextMenu.vue'
import type { Node } from '@/microcosm/types/schema'
import type { IntersectionData } from '@/views/spatial/utils/CanvasInteraction'
import { MINIMUM_NODE_SIZE } from '@/microcosm/types/constants'

const emit = defineEmits<{
    (e: 'on-create-node', node: Node): void
    (e: 'on-drop-files', results: string[]): void
    (e: 'on-node-focus', node_id: string | null): void
    (e: 'on-selection', selection: IntersectionData): void
    (e: 'on-node-select', node_id: string | null): void
}>()

const view = useCurrentSpatialView()
const cursor = usePointer()

const element = ref<HTMLElement>()

const onFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (target && target.getAttribute('tabindex') === '0' && target.dataset.node_id) {
        event.preventDefault()
        target.focus({ preventScroll: true })
        emit('on-node-focus', target.dataset.node_id)
    } else {
        emit('on-node-focus', null)
    }
}


const onMouseUp = (e: PointerEvent) => {
    if (isNewTool(view.tool)) {
        const data = view.screenToCanvas(view.selection.area)
        if (data.width > MINIMUM_NODE_SIZE.width && data.height > MINIMUM_NODE_SIZE.height) {
            emit('on-create-node', {
                type: 'html',
                content: '',
                ...data
            })
        }
    }
    view.finishAction({
        shiftKey: e.shiftKey
    })
}

const isMouseEvent = (e: PointerEvent | MouseEvent | TouchEvent): e is MouseEvent =>
    e.type.startsWith('mouse')

const isTouchEvent = (e: PointerEvent | MouseEvent | TouchEvent): e is TouchEvent =>
    e.type.startsWith('touch')

const onPointerDown = (e: PointerEvent) => {
    if (e.button === 2) {
        return
    }

    console.log(isMouseEvent(e))
    console.log(isTouchEvent(e))

    console.log(e)

    const touch = e.pointerType === 'touch'

    element.value?.focus()
    view.startAction({
        touch,
        distance: touch ? cursor.touchDistance : undefined,
        shiftKey: e.shiftKey
    })
}

const onTouchStart = (e: TouchEvent) => {
    view.startAction({
        touch: true,
        distance: e.touches.length === 2 ? cursor.touchDistance : undefined
    })
}

const onTouchEnd = () => {
    view.finishAction({ touch: true })
}

const onScroll = (e: WheelEvent) => {
    const point = {
        x: e.clientX,
        y: e.clientY
    }

    const delta = {
        x: e.deltaX,
        y: e.deltaY
    }

    view.scroll(point, delta)
}

const { width, height } = useElementSize(element)

watch([width, height], () => {
    if (element.value) {
        const { top: y, left: x, width, height } = element.value.getBoundingClientRect()
        view.setContainer({
            x,
            y,
            width,
            height
        })
    }
})

const setCSSVariables = () => {
    if (element.value) {
        element.value.style.setProperty('--spatial-view-translate-x', `${view.transform.translate.x}px`);
        element.value.style.setProperty('--spatial-view-translate-y', `${view.transform.translate.y}px`);
        element.value.style.setProperty('--spatial-view-scale', `${view.transform.scale}`);
    }
}

watch(view.transform, setCSSVariables)

onMounted(() => {
    setCSSVariables()
})

let inActiveTimeout: ReturnType<typeof setTimeout>

const dropActive = ref(false)

const onDragStart = () => {
    dropActive.value = true
    clearTimeout(inActiveTimeout)
}

const onDragEnd = () => {
    inActiveTimeout = setTimeout(() => {
        dropActive.value = false
    }, 50)
}

const onDrop = (e: DragEvent) => {
    if (e.dataTransfer) {
        onDragEnd()
        const files = [...e.dataTransfer.files]

        Promise.all(files.map(parseFileToHTMLString)).then((results) => {
            const htmlStrings = results.filter(isString)
            emit('on-drop-files', htmlStrings)
        })
    }
}

const ctxMenu: ContextMenuOption[] = [
    {
        type: 'button',
        id: 'duplicate',
        title: 'Duplicate'
    },
    {
        type: 'button',
        id: 'copy',
        title: 'Copy'
    },
    {
        type: 'button',
        id: 'cut',
        title: 'Cut'
    }
]
</script>

<template>
    <ContextMenuVue @change="console.log" :options="ctxMenu">
        <section role="presentation" :class="{
            container: true,
            ['drop-active']: dropActive,
            [view.tool]: true
        }" @wheel.prevent="onScroll" @dragenter.prevent="onDragStart" @dragover.prevent="onDragStart"
            @focusin="onFocus" @dragleave.prevent="onDragEnd" @drop.prevent="onDrop" @pointerdown="onPointerDown"
            ref="element" tabindex="0" @pointerup.prevent.self="onMouseUp">
            <slot></slot>
        </section>
    </ContextMenuVue>
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
    opacity: 0;
}

.container.drop-active::after {
    pointer-events: initial;
    opacity: 1;
}
</style>
