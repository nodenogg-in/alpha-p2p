<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Panel, VueFlow, useVueFlow } from '@vue-flow/core';
import { randomInt } from '@figureland/kit/math/random'
import ResizableNode from './ResizableNode.vue'

import { client, useApp, useCurrentMicrocosm } from '@/state'
import { SPATIAL_VIEW_INJECTION_KEY, useSpatialView } from './use-spatial-view'
import Debug from './components/Debug.vue'
import SimpleNode from './SimpleNode.vue'
import { entity, type Entity } from '@nodenogg.in/core';

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
}

const update = async (entity: Entity, content: string) => {
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

</script>

<template>
    <div class="container">
        <div class="actions">
            <button @click="create('')" class="button">New node</button>
        </div>
        <div class="nodes">
            <SimpleNode v-for="e in entities" v-bind:key="`node/${e.uuid}`" :entity="e"
                :onChange="html => update(e, html)" :onDelete="() => deleteEntity(e)" />
        </div>
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
