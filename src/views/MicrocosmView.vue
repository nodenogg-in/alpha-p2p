<script setup lang="ts">
import { useMicrocosmStore } from '../stores/microcosm'

const store = useMicrocosmStore('nodenoggin', 'adam')()

const addRandomNode = () => {
    store.addNode({
        content: `content example ${Math.random()}`,
        x: 0,
        y: 0
    })
}


</script>

<template>
    <div class="microcosm">
        <h1>This is a microcosm</h1>
        <button @click="addRandomNode">Add random node</button>
        <ul>
            <li v-for="node in store.nodes" v-bind:key="node.content">
                {{ node.content }}
            </li>
        </ul>
    </div>
</template>

<style>
ul {
    border: 1px solid white;
}
</style>
