<script setup lang="ts">
import { provide } from 'vue'
import type { Node } from '@nodenogg.in/microcosm'

import { useApp, useCurrentMicrocosm, useCurrentView } from '@/state'
import Toolbar from './components/Toolbar.vue'
import ZoomControls from './components/ZoomControls.vue'
import Collection from '@/components/node/Collection.vue'
import NodeCard from './components/card/NodeCard.vue'
import Canvas from './Canvas.vue'
import { SPATIAL_VIEW_INJECTION_KEY, useSpatialView } from './use-spatial-view'
import { ContextMenu, ContextMenuItem } from '@/components/context-menu'
import ColorSelector from '@/components/color-selector/ColorSelector.vue'
import Debug from './components/Debug.vue'
import Dev from './components/Dev.vue'

defineProps({
  ui: {
    type: Boolean
  }
})

const app = useApp()
const microcosm = useCurrentMicrocosm()
const view = useCurrentView()
const spatial = await useSpatialView(microcosm.microcosmID, view.view_id)
provide(SPATIAL_VIEW_INJECTION_KEY, spatial)

</script>

<template>
  <ContextMenu>
    <Canvas v-if="view">
      <Collection v-for="identityID in spatial.collections" :identityID="identityID"
        v-bind:key="`collection/${microcosm.microcosmID}/${identityID}`" v-slot="{ node, nodeID, remote, identity }">
        <NodeCard :node="(node as Node<'html'>)" v-if="true" :nodeID="nodeID" :remote="remote" :identity="identity" />
      </Collection>
      <!-- <h1 class="large">The quick brown fox jumps over the lazy dog</h1>
      <h1>12345 The quick brown fox jumps over the lazy dog</h1> -->
      <Dev />
    </Canvas>
    <template v-slot:menu>
      <ColorSelector value="neutral" :on-update="console.log" />
      <ContextMenuItem value="copy" title="Copy" @click="console.log" />
      <ContextMenuItem value="cut" title="Cut" @click="console.log" />
      <ContextMenuItem value="share" title="Duplicate" @click="console.log" />
      <ContextMenuItem value="copy-link" title="Copy link" @click="console.log" />
    </template>
  </ContextMenu>
  <Toolbar v-if="ui && app.state.showUI" />
  <ZoomControls v-if="ui && app.state.showUI" />
  <Debug v-if="ui && app.state.showUI" />
</template>

<style scoped>
.large {
  font-size: 14em;
  line-height: 1.05em;
  letter-spacing: -0.02em;
}
</style>
