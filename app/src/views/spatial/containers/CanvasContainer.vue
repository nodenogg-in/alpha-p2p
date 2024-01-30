<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { isNewTool, useCurrentSpatialView } from '@/views/spatial'
import { parseFileToHTMLString } from '@/microcosm/parsers/file'
import ContextMenu from '@/components/ContextMenu.vue'
import type { ContextMenuOption } from '@/components/ContextMenu.vue'
import type { Node } from '@/microcosm/types/schema'
import { isString } from '@/microcosm/utils/guards'
import { MINIMUM_NODE_SIZE } from '@/microcosm/types/constants'
import type { IntersectionData } from '@/microcosm/spatial'

const emit = defineEmits<{
    (e: 'on-create-node', node: Node): void
    (e: 'on-drop-files', results: string[]): void
    (e: 'on-node-focus', node_id: string | null): void
    (e: 'on-selection', selection: IntersectionData): void
    (e: 'on-node-select', node_id: string | null): void
}>()

const view = useCurrentSpatialView()

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

const onPointerDown = (e: PointerEvent) => {
    if (e.button === 2) {
        return
    }

    element.value?.focus()
    view.startAction(e, {
        shiftKey: e.shiftKey
    })
}

const onPointerUp = (e: PointerEvent) => {
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
    view.finishAction(e, {
        shiftKey: e.shiftKey
    })
}

const onTouchStart = (e: TouchEvent) => {
    view.startAction(e, {
        touch: true
    })
}

const onTouchEnd = (e: TouchEvent) => {
    view.finishAction(e, { touch: true })
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
        element.value.style.setProperty('--spatial-view-translate-x', `${view.transform.translate.x.toFixed(3)}px`);
        element.value.style.setProperty('--spatial-view-translate-y', `${view.transform.translate.y.toFixed(3)}px`);
        element.value.style.setProperty('--spatial-view-scale', `${view.transform.scale.toFixed(3)}`);
        element.value.style.setProperty('--card-outline', `calc(2px / var(--spatial-view-scale))`);
        element.value.style.setProperty('--card-element-scale', `calc(1.0 / var(--spatial-view-scale))`);
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
        title: 'Copy',
        command: 'cmd+C'
    },
    {
        type: 'button',
        id: 'cut',
        title: 'Cut',
        command: 'cmd+X'
    }
]
</script>

<template>
    <ContextMenu :options="ctxMenu">
        <section :class="{
            container: true,
            ['drop-active']: dropActive,
            [view.tool]: true
        }" role="presentation" ref="element" tabindex="0" @wheel.prevent="onScroll" @dragenter.prevent="onDragStart"
            @dragover.prevent="onDragStart" @focusin="onFocus" @dragleave.prevent="onDragEnd" @drop.prevent="onDrop"
            @pointerdown="onPointerDown" @pointerup.prevent.self="onPointerUp" @ontouchstart.prevent="onTouchStart"
            @ontouchend.prevent="onTouchEnd">
            <slot></slot>
        </section>
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
</style>
@/microcosm/parsers/file