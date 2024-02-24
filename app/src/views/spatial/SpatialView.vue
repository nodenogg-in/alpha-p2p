<script setup lang="ts">
import { provide } from 'vue';

import { useApp, useCurrentMicrocosm } from '@/state'
import Toolbar from './components/Toolbar.vue'
import ZoomControls from './components/ZoomControls.vue';
import Collection from '@/components/node/Collection.vue';
import NodeCard from './components/card/NodeCard.vue';
import Canvas from './Canvas.vue';
import { SPATIAL_VIEW_INJECTION_KEY, useSpatialView } from './use-spatial-view';
import { ContextMenu, ContextMenuItem } from '@/components/context-menu';
import ColorSelector from '@/components/color-selector/ColorSelector.vue';

const app = useApp()
const microcosm = useCurrentMicrocosm()
const view = useSpatialView(microcosm.microcosm_uri)
provide(SPATIAL_VIEW_INJECTION_KEY, view)
</script>

<template>
    <ContextMenu>
        <Canvas v-if="view" :state="view.state" :tool="view.action.tool" @onPointerDown="view.onPointerDown"
            @onPointerUp="view.onPointerUp" @onWheel="view.actions.onWheel" @onFocus="view.actions.onFocus"
            @onResize="view.canvas.resize" :active="app.pointer.active">
            <Collection :component="NodeCard" v-for="user_id in microcosm.data.collections" :user_id="user_id"
                v-bind:key="`node-list-${user_id}`" />
        </Canvas>
        <template v-slot:menu>
            <ColorSelector :value="'neutral'" :on-update="console.log" />
            <ContextMenuItem value="copy" title="Copy" @click="console.log" />
            <ContextMenuItem value="cut" title="Cut" @click="console.log" />
            <ContextMenuItem value="share" title="Duplicate" @click="console.log" />
            <ContextMenuItem value="copy-link" title="Copy link" @click="console.log" />
        </template>
    </ContextMenu>
    <Toolbar />
    <ZoomControls />
    <!-- <Debug /> -->
</template>