<script lang="ts" setup>
import type { Identity } from 'nodenoggin/schema';
import type { PropType } from 'vue';

defineProps({
    identity: {
        type: Object as PropType<Identity>
    },
    selected: {
        type: Boolean
    }
})
</script>

<template>
    <span v-bind="$attrs" :class="{ avatar: true, selected }">
        {{ identity?.username || 'Anonymous' }}
    </span>
</template>

<style scoped>
span.avatar {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 var(--size-2);
    font-size: 0.75em;
    font-weight: 600;
    transform-origin: 0% 100%;
    transform: scale(var(--card-element-scale));
    background-color: inherit;
    border-radius: 0 var(--ui-radius) 0 0;
    z-index: 5;
}

span.selected {
    color: var(--ui-mono-0);
    background: var(--ui-primary-100);
}
</style>