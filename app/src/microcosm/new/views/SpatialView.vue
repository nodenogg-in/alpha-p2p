<script setup lang="ts">
import NewNodeCard from '../../NewNodeCard.vue'
import NodeCard from '../../NodeCard.vue'
import SpatialContainer from '@/components/SpatialContainer.vue'
import { useCurrentMicrocosm } from '@/stores/use-demo-state'

const { data, actions } = useCurrentMicrocosm()

const handleFiles = (files: string[]) => {
    files.forEach(html => {
        actions.createNode({
            html,
            x: 0,
            y: 0,
        })
    })
}

const addRandomNode = (html: string) => {
    // console.log(actions?.createNode)
    actions.createNode({
        html,
        x: 0,
        y: 0,
    })
}
</script>
  
<template>
    <SpatialContainer @files-dropped="handleFiles" class="microcosm" v-if="!!data">
        <ul>
            <li>
                <NewNodeCard :onSubmit="addRandomNode" />
            </li>
            <li v-for="[id, node] in data.localNodes" v-bind:key="id">
                <NodeCard :remote="false" :node="node" />
            </li>
        </ul>
        <ul>
            <li v-for="[id, node] in data.remoteNodes" v-bind:key="id">
                <NodeCard :remote="true" :node="node" />
            </li>
        </ul>
    </SpatialContainer>
</template>
  
<style scoped>
div.microcosm {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background: white;
    background-image: radial-gradient(rgba(0, 0, 0, 0.25) 1px, rgba(0, 0, 0, 0.05) 0);
    background-size: 20px 20px;
    background-position: -11px -11px;
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
  