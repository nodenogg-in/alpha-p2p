<script setup lang="ts">
import { useCurrentMicrocosm } from '@/state'
import Toolbar from './components/Toolbar.vue'
import ZoomControls from './components/ZoomControls.vue';
import Debug from './components/Debug.vue';
import Collection from '@/components/node/Collection.vue';
import NodeCard from './components/card/NodeCard.vue';
import { provide } from 'vue';
import { SPATIAL_VIEW_INJECTION_KEY, useSpatialView } from './use-spatial-view';
import Canvas from './Canvas.vue';

const microcosm = useCurrentMicrocosm()
const view = useSpatialView(microcosm.microcosm_uri)

provide(SPATIAL_VIEW_INJECTION_KEY, view)
</script>

<template>
    <Canvas v-if="view" :transform="view.state.transform" :tool="view.action.tool" @onPointerDown="view.handlePointerDown"
        @onPointerUp="view.handlePointerUp" @onWheel="view.handleWheel" @onFocus="view.handleFocus"
        @onResize="view.canvas.resize" :background="view.state.background" :active="view.pointer.active">
        <Collection :component="NodeCard" v-for="user_id in microcosm.data.collections" :user_id="user_id"
            v-bind:key="`node-list-${user_id}`" />
    </Canvas>
    <Toolbar />
    <ZoomControls />
    <Debug />
</template>