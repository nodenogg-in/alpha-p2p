<script lang="ts" setup>
import { useCurrentMicrocosm, defaultNodeSize } from '@/stores/use-microcosm';
import CanvasContainer from './containers/CanvasContainer.vue'
import CanvasSurface from './containers/CanvasSurface.vue';
import { useCurrentSpatialView } from './stores/use-spatial-view';
import DebugBox from './components/Box.vue'
import { transformBox, transformPoint } from './utils/interaction';
import { useCursor } from './stores/use-cursor';
import Debug from './components/Debug.vue';
import Minimap from './components/Minimap.vue';
import ZoomControls from './components/ZoomControls.vue';
import Indicator from './components/Indicator.vue';
import NodeList from './NodeList.vue';

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()
const cursor = useCursor()

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

</script>

<template>
    <CanvasContainer pannable trackpadPan @files-dropped="onFilesDropped">
        <CanvasSurface>
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
            <Indicator :position="transformPoint(cursor.touchPoint, view)" />
            <NodeList v-for="user_id in microcosm.nodeLists" :user_id="user_id" v-bind:key="`node-list-${user_id}`" />
            <DebugBox color="rgba(70,30,255,0.4)" :box="transformBox(cursor.selectionBox, view)" />
        </CanvasSurface>
        <!-- <Indicator outline :position="normalise(cursor.touchPoint, view)" /> -->
        <!-- <SelectionBox /> -->
        <ZoomControls :value="view.transform.scale" :onChange="view.zoom" label="Zoom" />
        <Minimap />
        <Debug />
    </CanvasContainer>
</template>