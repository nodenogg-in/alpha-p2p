<script setup lang="ts">
import { watch } from 'vue';
import { useMicrocosmStore, type MicrocosmStore } from '../stores/microcosm'
import NewNodeCard from './NewNode.vue';
import NodeCard from './NodeCard.vue';

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

// const store = useMicrocosmsStore()
let microcosm: MicrocosmStore

const registerMicrocosm = () => {
    if (props.namespace_id && props.microcosm_id) {
        microcosm = useMicrocosmStore(props.namespace_id, props.microcosm_id)
    }
}

registerMicrocosm()

watch(props, () => {
    registerMicrocosm()
})

const addRandomNode = (content: string) => {
    microcosm.addNode({
        content,
        x: 0,
        y: 0
    }, true)
}

</script>

<template>
    <div class="microcosm">
        <ul v-if="!!microcosm">
            <li>
                <NewNodeCard :onSubmit="addRandomNode" />
            </li>
            <li v-for="node in microcosm.nodes" v-bind:key="node.id">
                <NodeCard :content="node.content" />
            </li>
        </ul>
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
@/sync/WebRTCSync@/utils/sync/WebRTCSync