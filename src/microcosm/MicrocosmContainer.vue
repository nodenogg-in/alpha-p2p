<script setup lang="ts">
import { watch } from 'vue';
import { useMicrocosm, type MicrocosmStore, useApp } from '../stores/microcosm'
import NewNodeCard from './NewNodeCard.vue';
import NodeCard from './NodeCard.vue';
import type { RemoveAction, UpdateAction } from '@/types/actions';

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

const app = useApp()
let microcosm: MicrocosmStore

const register = () => {
    microcosm = useMicrocosm(props.namespace_id, props.microcosm_id)
}

watch(props, register)

register()

const addRandomNode = (content: string) => {
    microcosm.create([{
        content,
        x: 0,
        y: 0
    }], true)
}

</script>

<template>
    <div class="microcosm" v-if="!!microcosm">
        <ul>
            <li>
                <NewNodeCard :onSubmit="addRandomNode" />
            </li>
            <li v-for="[id, node] in microcosm.nodes" v-bind:key="id">
                <NodeCard :synced="app.identity !== node.author" :node="node"
                    :onUpdate="(u: UpdateAction['data']) => microcosm.update(u, true)"
                    :onRemove="(u: RemoveAction['data']) => microcosm.remove(u, true)" />
            </li>
        </ul>
        <aside>
            {{ app.identity }}
            {{ JSON.stringify(microcosm.peers) }}
            {{ JSON.stringify(microcosm.connected) }}
        </aside>
    </div>
</template>

<style scoped>
ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
}

li {
    width: 300px;
    height: 200px;
    padding: 10px;
    margin: 10px;
    list-style: none;
}

.blank {
    background: white;
    border: 2px dashed pink;
}
</style>
