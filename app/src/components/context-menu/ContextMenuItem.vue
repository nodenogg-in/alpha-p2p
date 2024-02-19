<script setup lang="ts">
import KeyCommandIcon from '@/views/spatial/components/KeyCommandIcon.vue';
import { ContextMenuItem } from 'radix-vue';
import type { PropType } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    commands: {
        type: Array as PropType<string[]>,
    },
    disabled: {
        type: Boolean
    },
})

const emit = defineEmits<{
    (e: 'click', id: string): void
}>()

</script>

<template>
    <ContextMenuItem v-bind="$attrs" :value="props.value" class="context-menu-item" :disabled="props.disabled">
        {{ props.title }}
        <div v-if="props.commands" class="right-slot">
            <KeyCommandIcon v-for="command in commands" v-bind:key="`cmd-${command}`"> {{ command }}</KeyCommandIcon>
        </div>
    </ContextMenuItem>
</template>

<style>
.context-menu-item {
    border-radius: var(--ui-radius);
    display: flex;
    align-items: center;
    padding: var(--size-8) var(--size-8);
    position: relative;
    user-select: none;
    outline: none;
    border-radius: var(--ui-radius);
    color: var(--ui-0);
    background: var(--ui-90);
    cursor: pointer;
}

@media (prefers-color-scheme: dark) {
    .context-menu-item {
        background-color: var(--ui-90);
    }
}


.context-menu-item:not(:last-child) {
    border-bottom: 1px solid var(--ui-80);
}

.context-menu-item[data-disabled] {
    color: var(--ui-50);
    cursor: not-allowed;
}

.context-menu-item[data-highlighted] {
    background: var(--ui-primary-100);
    color: var(--ui-100);
}

.right-slot {
    margin-left: auto;
    padding-left: 20px;
    font-size: 0.8em;
    opacity: 0.75;
}

[data-highlighted]>.right-slot {
    color: currentColor;
}
</style>