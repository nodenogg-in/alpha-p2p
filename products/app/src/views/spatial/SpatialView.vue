<script setup lang="ts">
import { provide } from 'vue'

import { useApp, useCurrentMicrocosm } from '@/state'
import Toolbar from './components/Toolbar.vue'
import ZoomControls from './components/ZoomControls.vue'
import Canvas from './Canvas.vue'
import { SPATIAL_VIEW_INJECTION_KEY, useSpatialView } from './use-spatial-view'
import { ContextMenu, ContextMenuItem } from '@/components/context-menu'
import ColorSelector from '@/components/color-selector/ColorSelector.vue'
import Debug from './components/Debug.vue'
import Dev from './components/Dev.vue'
import BrushSelection from './components/BrushSelection.vue'
import Entity from '@/components/Entity.vue'
import CardContainer from '@/components/node/CardContainer.vue'
import Editor from '@/components/editor/Editor.vue'
import { isEntityType } from '@nodenogg.in/microcosm'

const props = defineProps({
  view_id: {
    type: String,
    required: true
  },
  ui: {
    type: Boolean
  }
})

const app = useApp()
const microcosm = useCurrentMicrocosm()
const spatial = await useSpatialView(props.view_id)
provide(SPATIAL_VIEW_INJECTION_KEY, spatial)

</script>

<template>
  <ContextMenu>
    <Canvas v-if="spatial">
      <Entity v-for="entity_location in microcosm.entities" v-bind:key="`${spatial.view_id}/${entity_location}`"
        :entity="entity_location" v-slot="{ entity }">
        <CardContainer v-if="isEntityType(entity, 'html')" :transform="entity" :data-entity="entity_location">
          <Editor :value="entity.body" :on-change="() => { }" scroll />
          <!-- {{ JSON.stringify(entity.body) }} -->
        </CardContainer>
      </Entity>
      <h1 class="text-8xl font-bold underline">
        Hello world!
      </h1>
      <BrushSelection />
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
  <Debug v-if="app.state.showUI" />
</template>

<style scoped>
.large {
  font-size: 14em;
  line-height: 0.95em;
}
</style>
