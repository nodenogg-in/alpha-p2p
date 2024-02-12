<script lang="ts" setup>
import type { Identity } from 'nodenoggin-core/sync';
import type { PropType } from 'vue';

const props = defineProps({
    identity: {
        type: Object as PropType<Identity>
    }
})
</script>

<template>
    <span v-bind="$attrs">
        {{ props.identity?.username || 'Anonymous' }}
    </span>
</template>

<style scoped>
span {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 5px;
    font-size: 8px;
    opacity: 0.5;
    font-weight: bold;
    transform-origin: 0% 100%;
    transform: scale(var(--card-element-scale));
}
</style>