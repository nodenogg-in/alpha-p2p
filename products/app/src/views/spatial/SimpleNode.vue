<script setup lang="ts">
import { watch, ref } from 'vue'
import ContextMenu from '@/components/context-menu/ContextMenu.vue';
import ContextMenuItem from '@/components/context-menu/ContextMenuItem.vue';
import Editor from '@/components/editor/Editor.vue'
import { entity as entityAPI, type Entity } from '@nodenogg.in/core'

const props = defineProps<{
    onChange: (html: string) => void
    onDelete: () => void
    entity: Entity
    isEditing: boolean
}>()

const emit = defineEmits(['startEditing', 'stopEditing'])

// Handle when editor should activate
const onStartEditing = () => {
    emit('startEditing')
}

// Handle when editor loses focus
const onStopEditing = () => {
    emit('stopEditing')
}

// Watch for changes in isEditing prop
watch(() => props.isEditing, (newValue) => {
    if (!newValue) {
        // Handle cleanup when editing stops
    }
})

</script>

<template>
    <ContextMenu>
        <div class="node" v-if="entityAPI.isEntityType(entity, 'html')" :class="{ 'is-editing': isEditing }">
            <Editor :value="entity.data.content" :onChange="onChange" :editable="isEditing" @click="onStartEditing"
                @cancel="onStopEditing" />
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
    transition: border-color 0.2s ease;
}

.node.is-editing {
    box-shadow: 0 0 8px rgba(var(--ui-primary-rgb), 0.5);
}
</style>
