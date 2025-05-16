<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Panel, VueFlow, useVueFlow } from '@vue-flow/core';
import { randomInt } from '@figureland/kit/math/random'
import ResizableNode from './ResizableNode.vue'

import { client, useCurrentMicrocosm } from '@/state'
import SimpleNode from './SimpleNode.vue'
import { type Entity } from '@nodenogg.in/core';

const props = defineProps({
    view_id: {
        type: String,
        required: true
    },
    ui: {
        type: Boolean
    }
})


const nodes = ref([
    {
        id: '1',
        type: 'resizable',
        data: { label: 'NodeResizer' },
        position: { x: 0, y: 0 },
        style: { background: '#fff', border: '2px solid black' },
    },
])

const microcosm = useCurrentMicrocosm()

const updateEntity = async (entity: Entity, content: string) => {
    const identity = client.identity.get()
    if (identity) {
        await microcosm.api.update([[{
            entity_id: entity.uuid,
            identity_id: identity.uuid,
        }, {
            content
        }]])
    }
}

const deleteEntity = async (entity: Entity) => {
    const identity = client.identity.get()
    if (identity) {
        await microcosm.api.delete([{
            entity_id: entity.uuid,
            identity_id: identity.uuid,
        }])
    }
}

const { entities } = storeToRefs(microcosm)

// Track which node is currently being edited
const editingNodeId = ref<string | null>(null)

// Set the active node for editing
const setEditingNode = (nodeId: string | null) => {
    editingNodeId.value = nodeId
}

const createEntity = async () => {
    const result = await microcosm.api.create({
        type: 'html',
        x: randomInt(-400, 400),
        y: randomInt(-400, 400),
        width: 200,
        height: 200,
        content: ''
    })

    if (result && result.uuid) {
        editingNodeId.value = result.uuid
    }
}

provide('editingNodeId', editingNodeId)

const positionedNodes = computed(() => {
    return entities.value.map((node) => {
        return {
            id: node.uuid,
            type: 'resizable',
            data: { label: 'NodeResizer' },
            position: { x: node.data.x, y: node.data.y },
            dimensions: { width: node.data.width, height: node.data.height },
            style: { background: '#fff', border: '2px solid black' },
        }
    })
})
</script>

<template>
    <div class="container">
        <div class="actions">
            <button @click="createEntity" class="button">New node</button>
        </div>
        <div class="nodes">
            <SimpleNode v-for="e in entities" v-bind:key="`node/${e.uuid}`" :entity="e"
                :onChange="html => updateEntity(e, html)" :onDelete="() => deleteEntity(e)"
                :isEditing="editingNodeId === e.uuid" @startEditing="setEditingNode(e.uuid)"
                @stopEditing="setEditingNode(null)" />
        </div>
        <!-- <VueFlow :nodes="positionedNodes" fit-view-on-init class="pinia-flow">
            <template #node-resizable="resizableNodeProps">
                <ResizableNode :data="resizableNodeProps.data" />
            </template>
        </VueFlow> -->

    </div>
</template>

<style scoped>
.button {
    cursor: pointer;
    background: var(--ui-95);
    box-shadow: var(--ui-container-shadow);
    border-radius: calc(var(--ui-radius));
    padding: var(--size-8);
}

.button:hover {
    background: var(--ui-primary-100);
    color: var(--ui-100);
}

.actions {
    padding: var(--size-12) 0;
    gap: var(--size-4);
}

.nodes {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1em;
    width: 100%;
    height: 100%;
    overflow-y: auto;
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
