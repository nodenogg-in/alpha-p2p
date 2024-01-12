<script setup lang="ts">
import { watch } from 'vue'
import { useAppState } from '../stores/use-app-state'
import NewNodeCard from './NewNodeCard.vue'
import NodeCard from './NodeCard.vue'
import MicrocosmDebug from './MicrocosmDebug.vue'
import SpatialContainer from '@/components/SpatialContainer.vue'

const props = defineProps({
  namespace_id: {
    type: String,
    required: true
  },
  microcosm_id: {
    type: String,
    required: true
  }
})

const app = useAppState()

const register = () => {
  app.registerMicrocosm(props.namespace_id, props.microcosm_id)
}

watch(props, register)

register()

const handleFiles = (files: string[]) => {
  files.forEach(html => {
    app.createNode({
      html,
      x: 0,
      y: 0,
    })
  })
}

const addRandomNode = (html: string) => {
  app.createNode({
    html,
    x: 0,
    y: 0,
  })
}
</script>

<template>
  <SpatialContainer @files-dropped="handleFiles" class="microcosm" v-if="!!app.microcosm">
    <ul>
      <li>
        <NewNodeCard :onSubmit="addRandomNode" />
      </li>
      <li v-for="[id, node] in app.microcosm?.localNodes" v-bind:key="id">
        <NodeCard :remote="false" :node="node" />
      </li>
    </ul>
    <ul>
      <li v-for="[id, node] in app.microcosm?.remoteNodes" v-bind:key="id">
        <NodeCard :remote="true" :node="node" />
      </li>
    </ul>
  </SpatialContainer>
  <MicrocosmDebug :microcosm="app.microcosm" />
</template>

<style scoped>
div.microcosm {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  width: 300px;
  height: 200px;
  padding: 10px;
  margin: 10px;
  list-style: none;
  display: inline-flex;
}
</style>
../stores/app
