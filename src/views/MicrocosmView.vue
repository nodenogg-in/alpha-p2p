<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useMicrocosmStore, useMicrocosmsStore, type MicrocosmStore } from '../stores/microcosm'
import { useRoute } from 'vue-router';
import { P2PManager, type NNode } from '@/p2p';

const p2p = ref(new P2PManager())
const route = useRoute()

let store: MicrocosmStore
const microcosm = useMicrocosmsStore()

const registerMicrocosm = (id: string) => {
    if (id) {
        microcosm.setActiveMicrocosm(id)
        store = useMicrocosmStore(id)
        p2p.value.init('nodenoggin', id)

        p2p.value.getNode((data, _peerId) => {
            store?.addNode(data as NNode)
        })
    }
}

onMounted(() => {
    registerMicrocosm(route.params.microcosm_id as string)
})

watch(route, () => {
    registerMicrocosm(route.params.microcosm_id as string)
})

const message = ref<string>('')

const addRandomNode = () => {
    const newNode = {
        content: message.value,
        x: 0,
        y: 0
    }

    store.addNode(newNode)
    p2p.value.sendNode(newNode)
}

const handleKeypress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        addRandomNode()
        message.value = ''
    }
}
</script>

<template>
    <div class="microcosm">
        <li class="blank">
            <input v-model="message" @keypress="handleKeypress" placeholder="New node...">
            <button @click="addRandomNode">Add</button>
        </li>
        <ul v-if="!!store">
            <li v-for="node in store.nodes" v-bind:key="node.content">
                {{ node.content }}
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
    color: black;
    padding: 10px;
    margin: 10px;
    background: pink;
    width: 300px;
    height: 200px;
    list-style: none;
}

.blank {
    background: white;
    border: 2px dashed pink;
}
</style>
