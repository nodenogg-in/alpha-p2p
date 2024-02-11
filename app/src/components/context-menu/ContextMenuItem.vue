<script setup lang="ts">
import { ContextMenuItem, ContextMenuSeparator } from 'radix-vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    command: {
        type: String,
    },
    disabled: {
        type: Boolean
    },
    separator: {
        type: Boolean
    }
})

const emit = defineEmits<{
    (e: 'click', id: string): void
}>()

</script>

<template>
    <ContextMenuItem v-bind="$attrs" :value="props.value" class="context-menu-item" @click="emit('click', props.value)"
        :disabled="props.disabled">
        {{ props.title }}
        <div v-if="props.command" class="right-slot">
            {{ props.command }}
        </div>
        <ContextMenuSeparator class="separator" v-if="props.separator" />
    </ContextMenuItem>
</template>

<style>
.context-menu-item {
    border-radius: var(--ui-radius);
    display: flex;
    align-items: center;
    height: 25px;
    padding: 0 5px;
    position: relative;
    user-select: none;
    outline: none;
    border-radius: var(--ui-radius);
    cursor: pointer;
}

.context-menu-item[data-disabled] {
    color: var(--ui-50);
    pointer-events: none;
}

.context-menu-item[data-highlighted] {
    background: var(--ui-primary-30);
    color: var(--ui-0);
}

.separator {
    height: 1px;
    background-color: var(--grass-6);
    margin: 5px;
}

.right-slot {
    margin-left: auto;
    padding-left: 20px;
    color: var(--ui-60);
    font-size: 10px;
}

[data-highlighted]>.right-slot {
    color: currentColor;
}

[data-disabled] .right-slot {
    color: var(--mauve-8);
}
</style>