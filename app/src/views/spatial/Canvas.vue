<script lang="ts" setup>
import { useCurrentMicrocosm, defaultNodeSize } from '@/stores/use-microcosm';
import CanvasContainer from './containers/CanvasContainer.vue'
import CanvasSurface from './containers/CanvasSurface.vue';
import { useCurrentSpatialView } from './stores/use-spatial-view';
import DebugBox from './components/Box.vue'
import { useCursor } from './stores/use-cursor';
import Debug from './components/Debug.vue';
import Minimap from './components/Minimap.vue';
import ZoomControls from './components/ZoomControls.vue';
import Indicator from './components/Indicator.vue';
import NodeList from './NodeList.vue';
import SelectionBox from './components/SelectionBox.vue';

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
                width: 300,
                height: 300,
                x: 1200,
                y: 1500
            }" />
            <Indicator :position="view.screenToCanvas(cursor.touchPoint)" />
            <NodeList v-for="user_id in microcosm.nodeLists" :user_id="user_id" v-bind:key="`node-list-${user_id}`" />
            <SelectionBox />
        </CanvasSurface>
        <DebugBox color="red" :scaled="true" :box="view.canvasToScreen({
            width: 300,
            height: 300,
            x: 1500,
            y: 1500
        }, false)" />

        <!-- <Indicator outline :position="normalise(cursor.touchPoint, view)" /> -->
        <!-- <SelectionBox /> -->
        <ZoomControls :value="view.transform.scale" :onChange="view.zoom" label="Zoom" />
        <Minimap />
        <Debug />
    </CanvasContainer>
</template>