<script setup lang="ts">
import { useCurrentMicrocosm } from '@/microcosm/stores'
import SpatialViewProvider from './SpatialViewProvider.vue'
import Toolbar from './components/Toolbar.vue'
import Canvas from './Canvas.vue'

const microcosm = useCurrentMicrocosm()
</script>

<template>
    <SpatialViewProvider :microcosm_uri="microcosm.microcosm_uri">
        <Canvas />
        <Toolbar />
    </SpatialViewProvider>
</template>
