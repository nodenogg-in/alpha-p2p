<script lang="ts" setup>
import { Tool } from 'nodenoggin/spatial'

import { useCurrentSpatialView } from '@/views/spatial'
import CanvasContainer from './CanvasContainer.vue'

const view = useCurrentSpatialView()

const handleFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (target && target.getAttribute('tabindex') === '0' && target.dataset.node_id) {
        event.preventDefault()
        target.focus({ preventScroll: true })
        const { node_id } = target.dataset
        console.log(node_id)
    }
}

// const handleCreateNode = (node: Node) => {
//     const id = microcosm.create(node)
//     view.editingNode = id
//     view.setTool(Tool.Select)
// }

const handlePointerDown = (e: PointerEvent) => {
    if (e.button === 2) {
        return
    }

    view.startAction()
}

const handlePointerUp = (e: PointerEvent) => {
    view.finishAction()
}

const handleWheel = (e: WheelEvent) => {
    const point = {
        x: e.clientX,
        y: e.clientY
    }

    const delta = {
        x: e.deltaX,
        y: e.deltaY
    }

    if (view.action.tool !== Tool.Move && delta.y % 1 === 0) {
        view.canvas.pan(delta)
    } else {
        view.canvas.scroll(point, delta)
    }
}
</script>

<template>
    <CanvasContainer v-if="view" :transform="view.state.transform" :tool="view.action.tool"
        @onPointerDown="handlePointerDown" @onPointerUp="handlePointerUp" @onWheel="handleWheel" @onFocus="handleFocus"
        @onResize="view.canvas.setContainer" :background="view.state.background">
        <slot></slot>
    </CanvasContainer>
</template>