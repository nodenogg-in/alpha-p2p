<script setup lang="ts">
import { computed, provide, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { Panel, VueFlow, useVueFlow, type NodeChange, type XYPosition, type Dimensions } from '@vue-flow/core';
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'

import { randomInt } from '@figureland/kit/math/random'

import { client, useCurrentMicrocosm } from '@/state'

import { type Entity, entity } from '@nodenogg.in/core';
import ResizableNode from '../ResizableNode.vue';

const props = defineProps({
    view_id: {
        type: String,
        required: true
    },
    ui: {
        type: Boolean
    }
})


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

const { onNodesChange, findNode, viewport, onPaneReady, setViewport } = useVueFlow()

// Reactive reference to track the canvas element
const canvasContainer = ref<HTMLElement | null>(null)

// Local storage key for view state
const getLocalStorageKey = () => `spatial-view-state-${props.view_id}`

// Debounce timer
let saveStateTimer: number | null = null

// Function to save view state to local storage (debounced)
const saveViewState = () => {
    if (saveStateTimer) {
        window.clearTimeout(saveStateTimer)
    }

    saveStateTimer = window.setTimeout(() => {
        try {
            const state = {
                x: viewport.value.x,
                y: viewport.value.y,
                zoom: viewport.value.zoom
            }
            localStorage.setItem(getLocalStorageKey(), JSON.stringify(state))
        } catch (error) {
            console.error('Failed to save view state to local storage:', error)
        }
    }, 1000) // 1 second debounce
}

// Function to load view state from local storage
const loadViewState = () => {
    try {
        const savedState = localStorage.getItem(getLocalStorageKey())
        if (savedState) {
            const state = JSON.parse(savedState) as { x: number; y: number; zoom: number }
            // Use setViewport to set the viewport state
            setViewport({ x: state.x, y: state.y, zoom: state.zoom })
        }
    } catch (error) {
        console.error('Failed to load view state from local storage:', error)
    }
}

// Watch viewport changes to save state
watch(() => ({ ...viewport.value }), () => {
    saveViewState()
}, { deep: true })

// Clean up timer on component unmount
onBeforeUnmount(() => {
    if (saveStateTimer) {
        window.clearTimeout(saveStateTimer)
    }
})

// Watch for zoom changes and update CSS variable
watch(() => viewport.value.zoom, (newZoom) => {
    if (canvasContainer.value) {
        canvasContainer.value.style.setProperty('--zoom-value', String(newZoom))
    }
})

// Set up the canvas element reference when the pane is ready
onPaneReady((instance) => {
    console.log(canvasContainer.value)
    // Load the saved view state
    loadViewState()
    // canvasContainer.value = instance.flowElement
    // // Initial setup of the CSS variable
    // canvasContainer.value.style.setProperty('--zoom-value', String(viewport.value.zoom))
})

const handleNodeChange = async (changes: NodeChange[]) => {
    // Process position and dimension changes
    for (const change of changes) {
        // Handle position changes
        if (change.type === 'position' && change.position) {
            const entity = entities.value.find(e => e.uuid === change.id)
            if (entity) {
                await updateEntityPosition(entity, change.position)
            }
        }

        // Handle dimension changes
        if (change.type === 'dimensions' && change.dimensions) {
            const entity = entities.value.find(e => e.uuid === change.id)
            if (entity) {
                console.log('Dimensions change detected:', change.dimensions)
                await updateEntityDimensions(entity, change.dimensions)
            }
        }
    }
}

// Update entity position in the database
const updateEntityPosition = async (entity: Entity, position: XYPosition) => {
    const identity = client.identity.get()
    if (identity) {
        await microcosm.api.update([[
            {
                entity_id: entity.uuid,
                identity_id: identity.uuid,
            },
            {
                x: position.x,
                y: position.y
            }
        ]])
    }
}

// Update entity dimensions in the database
const updateEntityDimensions = async (entity: Entity, dimensions: Dimensions) => {
    const identity = client.identity.get()
    if (identity) {
        await microcosm.api.update([[
            {
                entity_id: entity.uuid,
                identity_id: identity.uuid,
            },
            {
                width: dimensions.width,
                height: dimensions.height
            }
        ]])
    }
}

// Register the node change handler
onNodesChange(handleNodeChange)

const positionedNodes = computed(() => {
    return entities.value.filter(e => entity.isEntityType(e, 'html')).map((entity) => {
        const { width, height, x, y } = entity.data
        return {
            id: entity.uuid,
            type: 'resizable',
            data: entity,
            position: {
                x,
                y
            },
            dimensions: {
                width,
                height
            },
        }
    })
})
</script>

<template>
    <div class="container" ref="canvasContainer">
        <!-- <div class="actions">
            <button @click="createEntity" class="button">New node</button>
        </div>
        <div class="nodes">
            <SimpleNode v-for="e in entities" v-bind:key="`node/${e.uuid}`" :entity="e"
                :onChange="html => updateEntity(e, html)" :onDelete="() => deleteEntity(e)"
                :isEditing="editingNodeId === e.uuid" @startEditing="setEditingNode(e.uuid)"
                @stopEditing="setEditingNode(null)" />
        </div> -->
        <VueFlow :nodes="positionedNodes" fit-view-on-init class="pinia-flow" @nodes-change="handleNodeChange"
            pan-on-scroll>
            <Background />
            <MiniMap pannable zoomable class="mini-map" title="Mini map" />
            <template #node-resizable="resizableNodeProps">
                <ResizableNode :entity="resizableNodeProps.data" />
            </template>
        </VueFlow>

    </div>
</template>

<style scoped>
.mini-map {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--ui-90);
    box-shadow: var(--ui-container-shadow);
    border-radius: var(--ui-radius);
    padding: 0;
}

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
