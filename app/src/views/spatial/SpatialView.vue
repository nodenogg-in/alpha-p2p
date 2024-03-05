<script setup lang="ts">
import { provide } from 'vue';

import { useCurrentMicrocosm, useCurrentView } from '@/state'
import Toolbar from './components/Toolbar.vue'
import ZoomControls from './components/ZoomControls.vue';
import Collection from '@/components/node/Collection.vue';
import NodeCard from './components/card/NodeCard.vue';
import Canvas from './Canvas.vue';
import { SPATIAL_VIEW_INJECTION_KEY, useSpatialView } from './use-spatial-view';
import { ContextMenu, ContextMenuItem } from '@/components/context-menu';
import ColorSelector from '@/components/color-selector/ColorSelector.vue';
import type { Node } from 'nodenoggin/schema';
import Debug from './components/Debug.vue';
import Dev from './components/Dev.vue';

defineProps({
    ui: {
        type: Boolean
    }
})

const microcosm = useCurrentMicrocosm()
const view = useCurrentView()
const spatial = useSpatialView(microcosm.microcosm_uri, view.view_id)
provide(SPATIAL_VIEW_INJECTION_KEY, spatial)
</script>

<template>
    <ContextMenu>
        <Canvas v-if="view">
            <Collection v-for="user_id in microcosm.collections" :user_id="user_id"
                v-bind:key="`collection-node-${user_id}`" v-slot="{ node, node_id, remote, identity }">
                <NodeCard :node="(node as Node<'html'>)" v-if="true" :node_id="node_id" :remote="remote"
                    :identity="identity" />
            </Collection>
            <!-- <Dev /> -->
        </Canvas>
        <template v-slot:menu>
            <ColorSelector :value="'neutral'" :on-update="console.log" />
            <ContextMenuItem value="copy" title="Copy" @click="console.log" />
            <ContextMenuItem value="cut" title="Cut" @click="console.log" />
            <ContextMenuItem value="share" title="Duplicate" @click="console.log" />
            <ContextMenuItem value="copy-link" title="Copy link" @click="console.log" />
        </template>
    </ContextMenu>
    <Toolbar v-if="ui" />
    <ZoomControls v-if="ui" />
    <Debug v-if="ui"/>
</template>