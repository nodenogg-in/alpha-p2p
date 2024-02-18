<script lang="ts" setup>
import { isString, parseFileToHTMLString } from 'nodenoggin-core/utils'
import { Tool, MINIMUM_NODE_SIZE, interact } from 'nodenoggin-core/views/canvas'

import { useCurrentMicrocosm } from '@/state'
import { useCurrentSpatialView } from '@/views/spatial'
import CanvasContainer from './CanvasContainer.vue'

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()

const handleDropFiles = async (files: File[]) => {
    const results = await Promise.all(files.map(parseFileToHTMLString))

    const filesHTML = results.filter(isString)

    const nodes = filesHTML.map(content => ({
        type: 'html',
        content
    }))

    const positionedNodes = interact.getNodePositions(view.canvas.state, nodes)
    microcosm.create(positionedNodes)
}

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

    view.startAction(e, {
        shiftKey: e.shiftKey
    })
}

const handlePointerUp = (e: PointerEvent) => {
    if (view.isTool(Tool.New)) {
        const node = view.canvas.screenToCanvas(view.selection.box)
        if (node.width > MINIMUM_NODE_SIZE.width && node.height > MINIMUM_NODE_SIZE.height) {
            microcosm.create({
                type: 'html',
                content: '',
                ...node
            })
        }
    }
    view.finishAction(e, {
        shiftKey: e.shiftKey
    })
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

    if (!view.isTool(Tool.Move) && delta.y % 1 === 0) {
        view.canvas.pan(delta)
    } else {
        view.canvas.scroll(point, delta)
    }
}
</script>

<template>
    <CanvasContainer :transform="view.canvas.state.transform" :tool="view.tool" @onPointerDown="handlePointerDown"
        @onPointerUp="handlePointerUp" @onWheel="handleWheel" @onDropFiles="handleDropFiles" @onFocus="handleFocus"
        @onResize="view.canvas.setContainer" :background="view.canvas.state.background">
        <slot></slot>
    </CanvasContainer>
</template>