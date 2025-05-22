<script setup lang="ts">
import { watch, ref } from 'vue'
import ContextMenu from '@/components/context-menu/ContextMenu.vue';
import ContextMenuItem from '@/components/context-menu/ContextMenuItem.vue';
import Editor from '@/components/editor/Editor.vue'
import { EntitySchema, type Entity } from '@nodenogg.in/schema'

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

// Handle keyboard events
const handleKeydown = (event: KeyboardEvent) => {
    // Handle Space or Enter key to enter edit mode
    // if (event.key === 'Enter' || event.key === ' ') {
    //     event.preventDefault()
    //     onStartEditing()
    // }
}

// Watch for changes in isEditing prop
watch(() => props.isEditing, (newValue) => {
    if (!newValue) {
        // Handle cleanup when editing stops
    }
})

const { isType } = EntitySchema.utils

</script>

<template>
    <ContextMenu >
        <div class="node" v-if="isType(entity, 'html')" :class="{ 'is-editing': isEditing }"
            tabindex="0" >
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
    width: 100%;
    min-height: calc(var(--size-2) * 100);
    background: var(--ui-80);
    color: var(--ui-0);
    border-radius: var(--ui-radius);
    display: inline-block;
    transition: border-color 0.2s ease, outline 0.2s ease;
    outline: none;
}

.node:focus {
    outline: 2px solid var(--ui-primary-100);
    outline-offset: 2px;
}

.node.is-editing {
    box-shadow: 0 0 8px rgba(var(--ui-primary-rgb), 0.5);
}
</style>
