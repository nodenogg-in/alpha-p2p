<script lang="ts" setup>
import { useCurrentMicrocosm, defaultNodeSize } from '@/microcosm/stores/microcosm'
import CanvasContainer from './containers/CanvasContainer.vue'
import CanvasSurface from './containers/CanvasSurface.vue'
import { useCurrentSpatialView } from './stores/use-spatial-view'
import Debug from './components/Debug.vue'
import Minimap from './components/Minimap.vue'
import ZoomControls from './components/ZoomControls.vue'
import NodeList from './NodeList.vue'
import SelectionBox from './components/SelectionBox.vue'
import type { IntersectionData } from './utils/CanvasInteraction'
import SelectionGroup from './components/SelectionGroup.vue'

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()

const onFilesDropped = (filesHTML: string[]) => {
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

const handleSelection = (data: Partial<IntersectionData> = {}) => {
    view.selection.point = data.point || null
    if (data.selection) {
        view.selection.selection.nodes = data.selection.nodes
        view.selection.selection.boundingBox = data.selection.boundingBox
    }
}
</script>

<template>
    <CanvasContainer @on-drop-files="onFilesDropped" @on-create-node="microcosm.create" @on-node-focus="handleNodeFocus"
        @on-selection="handleSelection">
        <CanvasSurface>
            <NodeList v-for="user_id in microcosm.nodeLists" :user_id="user_id" v-bind:key="`node-list-${user_id}`" />
        </CanvasSurface>
        <SelectionBox />
        <ZoomControls />
        <Minimap />
        <Debug />
        <SelectionGroup />
    </CanvasContainer>
</template>
@/microcosm/stores/microcosm
