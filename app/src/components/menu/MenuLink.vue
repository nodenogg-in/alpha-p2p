<script setup lang="ts">
import type { ViewName } from 'nodenoggin-core/views';
import Dialog from '../Dialog.vue';
import { ContextMenu, ContextMenuItem } from '../context-menu';
import type { PropType } from 'vue';

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    },
    view: {
        type: String as PropType<ViewName>,
        required: true
    },
    active: {
        type: Boolean
    }
})
</script>

<template>
    <ContextMenu>
        <router-link :class="{ link: true, active: props.active, ui: true }" :to="{
            name: 'microcosm',
            params: {
                view: props.view,
                microcosm_uri: props.microcosm_uri
            }
        }">
            {{ props.microcosm_uri }}
        </router-link>
        <template v-slot:menu>
            <Dialog :title="`${props.microcosm_uri}`" :onConfirm="console.log"
                description="Are you sure you want to delete this microcosm?">
                <ContextMenuItem value="delete" :title="`Delete ${props.microcosm_uri}`" />
            </Dialog>
            <ContextMenuItem value="duplicate" :title="`Duplicate`" @click="console.log" disabled />
        </template>
    </ContextMenu>
</template>


<style scoped>
.link {
    box-sizing: border-box;
    padding: var(--size-8);
    display: block;
    cursor: pointer;
    /* font-size: 14px; */
    font-weight: 650;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
    border-radius: var(--ui-radius);
    width: 100%;
    user-select: none;
    display: flex;
    align-items: center;
    color: var(--ui-30);
    text-decoration: none;
}

/* .link::before {
    color: var(--ui-40);
    content: '/';
} */

.link:focus:not(.active) {
    box-shadow: var(--ui-shadow-primary);
}

.active {
    background: var(--ui-0);
    color: var(--ui-100);
}

.link:not(.active):hover {
    background: var(--ui-primary-100);
    color: var(--ui-mono-0);
}
</style>