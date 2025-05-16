<script setup lang="ts">
import ContextMenu from '@/components/context-menu/ContextMenu.vue';
import ContextMenuItem from '@/components/context-menu/ContextMenuItem.vue';
import Editor from '@/components/editor/Editor.vue'
import { entity as entityAPI, type Entity } from '@nodenogg.in/core'

const { entity, onChange, onDelete } = defineProps<{
    onChange: (html: string) => void
    onDelete: () => void
    entity: Entity
}>()

</script>

<template>
    <ContextMenu>
        <div class="node" v-if="entityAPI.isEntityType(entity, 'html')">
            <Editor :value="entity.data.content" :onChange="onChange" />
        </div>

        <template v-slot:menu>
            <ContextMenuItem value="delete" title="Delete" @click="onDelete" />
        </template>
    </ContextMenu>

</template>

<style scoped>
.node {
    position: relative;
    min-width: 200px;
    background: var(--ui-80);
    color: var(--ui-0);
    border-radius: var(--ui-radius);
    display: inline-block;
}
</style>
