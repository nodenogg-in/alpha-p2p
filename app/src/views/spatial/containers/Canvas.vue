<script lang="ts" setup>
import { useCurrentMicrocosm, defaultNodeSize } from '@/microcosm/stores'
import { Tool, useCurrentSpatialView } from '@/views/spatial'
import CanvasContainer from './CanvasContainer.vue'
import NodeList from '../NodeList.vue'
import Selection from '../components/Selection.vue'
import type { Node } from '@/microcosm/types/schema'
import BackgroundPattern from '../components/BackgroundPattern.vue'

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
        <div class="canvas-surface" role="presentation">
            <section class="canvas-background">
                <NodeList v-for="user_id in microcosm.nodeLists" :user_id="user_id" v-bind:key="`node-list-${user_id}`" />
            </section>
        </div>
        <Selection />
    </CanvasContainer>
</template>

<style scoped>
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
