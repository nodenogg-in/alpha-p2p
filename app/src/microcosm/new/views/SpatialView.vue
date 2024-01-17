<script setup lang="ts">
import { useCurrentMicrocosm } from '@/stores/use-microcosm';
import NodeList from './spatial/NodeList.vue'

const { data, actions } = useCurrentMicrocosm()

const handleFiles = (files: string[]) => {
    files.forEach(html => {
        // actions.createNode({
        //     html,
        //     x: 0,
        //     y: 0,
        // })
    })
}

const addRandomNode = () => {
    actions.create({
        html: Math.random().toString(),
        x: 0,
        y: 0,
    })
}
</script>
  
<template>
    <div class="inner">
        <button @click="addRandomNode">Add node</button>
        <NodeList v-for="(user_id) in data.nodeLists" :user_id="user_id" v-bind:key="`spatial${user_id}`" />
    </div>
</template>
  
<style scoped>
div.inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 70px 20px 20px 20px;
}
</style>
