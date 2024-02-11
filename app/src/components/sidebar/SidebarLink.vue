<script setup lang="ts">
import { ContextMenu, ContextMenuItem } from '../context-menu';

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    },
    active: {
        type: Boolean
    }
})
</script>

<template>
    <ContextMenu>
        <router-link :class="{ link: true, active: props.active }" :to="{
            name: 'microcosm',
            params: {
                view: 'spatial',
                microcosm_uri: props.microcosm_uri
            }
        }">
            {{ props.microcosm_uri }}
        </router-link>
        <template v-slot:menu>
            <ContextMenuItem value="delete" :title="`Delete ${props.microcosm_uri}`" @click="console.log" />
            <ContextMenuItem value="duplicate" :title="`Duplicate`" @click="console.log" disabled />
        </template>
    </ContextMenu>
</template>


<style scoped>
.link {
    box-sizing: border-box;
    padding: 6px;
    display: block;
    cursor: pointer;
    height: 30px;
    font-variation-settings: 'wght' 550;
    font-feature-settings: 'cv10' on, 'cv11' on, 'cv04' on, 'cv09' on, 'ss01' on, 'cv03' on, 'cv08' on, 'cv01' on;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
    border-radius: var(--ui-radius);
    width: 100%;
    user-select: none;
    display: flex;
    align-items: center;
}

/* .link::before {
    color: var(--ui-40);
    content: '/';
} */

.active {
    background: var(--ui-primary-100);
    color: var(--ui-100);
}

.link:not(.active):hover {
    background: var(--ui-primary-30);
    /* color: var(--ui-100); */
}
</style>