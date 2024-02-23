<script setup lang="ts">
import { useCurrentMicrocosm } from '@/state'
import Toolbar from './components/Toolbar.vue'
import Canvas from './containers/Canvas.vue'
import ZoomControls from './components/ZoomControls.vue';
import Debug from './components/Debug.vue';
import Collection from '@/components/node/Collection.vue';
import NodeCard from './components/card/NodeCard.vue';
import { provide } from 'vue';
import { SPATIAL_VIEW_INJECTION_KEY, useSpatialView } from './use-spatial-view';

const microcosm = useCurrentMicrocosm()
const view = useSpatialView(microcosm.microcosm_uri)

provide(SPATIAL_VIEW_INJECTION_KEY, view)
</script>

<template>
    <Canvas>
        <Collection :component="NodeCard" v-for="user_id in microcosm.data.collections" :user_id="user_id"
            v-bind:key="`node-list-${user_id}`" />
    </Canvas>
    <Toolbar />
    <ZoomControls />
    <Debug />
</template>