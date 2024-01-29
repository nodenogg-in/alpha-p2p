<script lang="ts" setup>
import { useCurrentMicrocosm, defaultNodeSize } from '@/microcosm/stores'
import { Tool, useCurrentSpatialView } from '@/views/spatial'
import CanvasContainer from './containers/CanvasContainer.vue'
import CanvasSurface from './containers/CanvasSurface.vue'
import Debug from './components/Debug.vue'
import ZoomControls from './components/ZoomControls.vue'
import NodeList from './NodeList.vue'
import SelectionBox from './components/SelectionBox.vue'
import SelectionGroup from './components/SelectionGroup.vue'
import type { Node } from '@/microcosm/types/schema'
import BackgroundPattern from './components/BackgroundPattern.vue'

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()

const handleDropFiles = (filesHTML: string[]) => {
    filesHTML.forEach((content) => {
        microcosm.create({
            type: 'html',
            content,
            x: 0,
            y: 0,
            ...defaultNodeSize
        })
    })
}

const handleNodeFocus = (node_id: string | null) => {
    view.selection.point = node_id
}
const handleSelection = () => {

}

const handleNodeSelect = (node_id: string | null) => {
    console.log('select', node_id)
}

const handleCreateNode = (node: Node) => {
    const id = microcosm.create(node)
    view.editingNode = id
    view.setTool(Tool.Select)
}

</script>

<template>
    <CanvasContainer @on-drop-files="handleDropFiles" @on-create-node="handleCreateNode" @on-node-focus="handleNodeFocus"
        @on-selection="handleSelection" @on-node-select="handleNodeSelect">
        <BackgroundPattern type="dots" />
        <CanvasSurface>
            <NodeList v-for="user_id in microcosm.nodeLists" :user_id="user_id" v-bind:key="`node-list-${user_id}`" />
        </CanvasSurface>
        <SelectionBox />
        <ZoomControls />
        <!-- <Minimap /> -->
        <!-- <Debug /> -->
        <SelectionGroup />
    </CanvasContainer>
</template>
