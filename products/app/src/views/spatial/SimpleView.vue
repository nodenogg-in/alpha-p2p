<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Panel, VueFlow, useVueFlow } from '@vue-flow/core';
import { randomInt } from '@figureland/kit/math/random'
import ResizableNode from './ResizableNode.vue'

import { useApp, useCurrentMicrocosm } from '@/state'
import { SPATIAL_VIEW_INJECTION_KEY, useSpatialView } from './use-spatial-view'
import Debug from './components/Debug.vue'
import SimpleNode from './SimpleNode.vue'
import  {entity, type Entity } from '@nodenogg.in/core';

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

const create = async (content: string) => {
   const result = await microcosm.api.create({
        type: 'html',
        x: randomInt(-400, 400),
        y: randomInt(-400, 400),
        width: 200,
        height: 200,
        content
    })
    console.log('created new entity!', result)
    console.log(entity.schema.validate(result))
}
// const spatial = await useSpatialView(props.view_id)

// provide(SPATIAL_VIEW_INJECTION_KEY, spatial)

const mapEntityToNode = (entity: Entity) => ({
    id: entity.id,
    type: 'resizable',
    label: entity.body,
    position: {
        x: entity.x || 0,
        y: entity.y || 0
    },
    class: 'light',
})


// const nodes = ref<any[]>([
//     {
//         id: '1',
//         type: 'resizable',
//         label: 'Node 1',
//         position: { x: 250, y: 5 },
//         class: 'light',m
//     },
//     {
//         id: '2',
//         type: 'resizable',
//         label: 'Node 2',
//         position: { x: 100, y: 100 },
//         class: 'light',
//     },
//     {
//         id: '3',
//         type: 'resizable',
//         label: 'Node 3',
//         position: { x: 400, y: 100 },
//         class: 'light',
//     },
//     {
//         id: '4',
//         type: 'resizable',

//         label: 'Node 4',
//         position: { x: 400, y: 200 },
//         class: 'light',
//     },
// ]);

const edges = ref<any[]>([
    // { id: 'e1-2', source: '1', target: '2' },
    // { id: 'e1-3', source: '1', target: '3' },
    // { id: 'e3-4', source: '3', target: '4' },
]);
const { onConnect, addEdges } = useVueFlow();

onConnect((params) => addEdges([params]));

// console.log(microcosm.entities)

const { entities } = storeToRefs(microcosm)
// const nodes = computed(() =>
//     entities.value.map(mapEntityToNode)
// )

const v = ref('')

// const { state, visible } = storeToRefs(spatial)
</script>

<template>
    <div class="container">
        <textarea type="text" class="ui" placeholder="New node" v-model="v"></textarea>
        <button @click="create(v)" class="button">Add</button>
        <div class="nodes">
{{JSON.stringify(entities)}}
            <SimpleNode v-for="entity_location in entities" v-bind:key="`something/${entity_location}`"
                :entity="entity_location" v-slot="{ entity }">
                {{ entity_location }}
            </SimpleNode>
        </div>

        <!-- <VueFlow v-model:nodes="nodes" v-model:edges="edges" class="pinia-flow" fit-view-on-init pan-on-scroll>
            <template #node-resizable="resizableNodeProps">
                <ResizableNode :data="resizableNodeProps" />
            </template>
        </VueFlow> -->
    </div>
</template>

<style scoped>
.button {
    padding: 0.5em;
    background: black;  
}
.button:active {
    background: #333;
}
.nodes {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    gap: 1em;
}

.pinia-flow {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.large {
    font-size: 14em;
    line-height: 0.95em;
}

.container {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 2em;
    padding-top: 6em;
}
</style>
