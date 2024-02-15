<script setup lang="ts">
import { useCurrentMicrocosm } from '@/state'
import SpatialViewProvider from './SpatialViewProvider.vue'
import Toolbar from './components/Toolbar.vue'
import Canvas from './containers/Canvas.vue'
import ZoomControls from './components/ZoomControls.vue';
import Debug from './components/Debug.vue';
import Minimap from './components/Minimap.vue';

const microcosm = useCurrentMicrocosm()
</script>

<template>
    <SpatialViewProvider :microcosm_uri="microcosm.microcosm_uri">
        <Canvas />
        <Toolbar />
        <ZoomControls />
        <Minimap />
        <Debug />
    </SpatialViewProvider>
</template>