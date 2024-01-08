<script setup lang="ts">
import { watch } from 'vue';
import { useMicrocosm, type MicrocosmStore, useAppState } from '../stores/microcosm'
import NewNodeCard from './NewNodeCard.vue';
import NodeCard from './NodeCard.vue';
import { pluralize } from '@/utils';
import MicrocosmDebug from './MicrocosmDebug.vue';

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
let microcosm: MicrocosmStore

const register = () => {
    microcosm = useMicrocosm(props.namespace_id, props.microcosm_id)
}

watch(props, register)

register()

const addRandomNode = (content: string) => {
    microcosm.createNode([{
        content,
        x: 0,
        y: 0
    }])
}

</script>

<template>
    <div class="microcosm" v-if="!!microcosm">
        <ul>
            <li>
                <NewNodeCard :onSubmit="addRandomNode" />
            </li>
            <li v-for="[id, node] in microcosm.localNodes" v-bind:key="id">
                <NodeCard :remote="false" :node="node" :onUpdate="microcosm.updateNode" :onRemove="microcosm.removeNode" />
            </li>
        </ul>
        <ul>
            <li v-for="[id, node] in microcosm.remoteNodes" v-bind:key="id">
                <NodeCard :remote="true" :node="node" :onUpdate="microcosm.updateNode" :onRemove="microcosm.removeNode" />
            </li>
        </ul>
    </div>
    <MicrocosmDebug :microcosm="microcosm" />
</template>

<style scoped>
div.microcosm {
    display: flex;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}

li {
    width: 300px;
    height: 200px;
    padding: 10px;
    margin: 10px;
    list-style: none;
}

aside {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgb(60, 60, 60);
    color: white;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
}
</style>
