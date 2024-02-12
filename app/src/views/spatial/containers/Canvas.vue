<script lang="ts" setup>
import { useCurrentMicrocosm, defaultNodeSize } from '@/state'
import { useCurrentSpatialView } from '@/views/spatial'
import CanvasContainer from './CanvasContainer.vue'
import NodeList from '../NodeList.vue'
import Selection from '../components/Selection.vue'
import { MINIMUM_NODE_SIZE } from 'nodenoggin-core/sync'
import { isString, parseFileToHTMLString } from 'nodenoggin-core/utils'
import { isNewTool } from 'nodenoggin-core/canvas'
import { getViewCenter } from '../stores/use-spatial-view'

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()

const handleDropFiles = (files: File[]) => {
    Promise.all(files.map(parseFileToHTMLString)).then((results) => {
        const filesHTML = results.filter(isString)
        const position = getViewCenter(view)
        filesHTML.forEach((content) => {
            microcosm.create({
                type: 'html',
                content,
                x: position.x - defaultNodeSize.width / 2,
                y: position.y - defaultNodeSize.height / 2,
                ...defaultNodeSize
            })
        })
    })
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
    if (isNewTool(view.tool)) {
        const data = view.screenToCanvas(view.selection.area)
        if (data.width > MINIMUM_NODE_SIZE.width && data.height > MINIMUM_NODE_SIZE.height) {
            microcosm.create({
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

const handleWheel = (e: WheelEvent) => {
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

</script>

<template>
    <CanvasContainer :transform="view.transform" :tool="view.tool" @onPointerDown="handlePointerDown"
        @onPointerUp="handlePointerUp" @onWheel="handleWheel" @onDropFiles="handleDropFiles" @onFocus="handleFocus"
        @onResize="view.setContainer" background="lines">
        <NodeList v-for="user_id in microcosm.nodeLists" :user_id="user_id" v-bind:key="`node-list-${user_id}`" />
    </CanvasContainer>
    <Selection />
</template>