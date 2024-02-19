<script setup lang="ts">
import {
    TooltipContent,
    TooltipPortal,
    TooltipRoot,
    TooltipTrigger
} from 'radix-vue'
import type { PropType } from 'vue';
import KeyCommandIcon from './KeyCommandIcon.vue';

const props = defineProps({
    delay: {
        type: Number,
        default: 30
    },
    keyCommand: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    tooltip: {
        type: String,
        required: true
    },
    side: {
        type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
        default: 'top'
    },
    align: {
        type: String as PropType<'start' | 'center' | 'end'>,
        default: 'center'
    },
    sideOffset: {
        type: Number,
        default: 5
    },
    disableClosingTrigger: {
        type: Boolean,
        default: false
    }
})

defineEmits<{
    click: [e: Event]
}>()
</script>

<template>
    <TooltipRoot :delayDuration="delay" :disableClosingTrigger="props.disableClosingTrigger">
        <TooltipTrigger as-child>
            <slot></slot>
        </TooltipTrigger>
        <TooltipPortal>
            <TooltipContent class="tooltip-content" :side-offset="props.sideOffset" :side="props.side" :align="props.align">
                {{ props.tooltip
                }}
                <KeyCommandIcon v-for="command in props.keyCommand" v-bind:key="`cmd-${command}`">
                    {{ command }}</KeyCommandIcon>
            </TooltipContent>
        </TooltipPortal>
    </TooltipRoot>
</template>

<style>
.tooltip-content {
    border-radius: var(--ui-radius);
    padding: var(--size-8) var(--size-8);
    font-size: 1em;
    color: var(--ui-10);
    background-color: var(--ui-80);
    user-select: none;
    z-index: 1000;
    display: flex;
    font-weight: 600;
    align-items: center;
}

.tooltip-content>span {
    margin-left: 0.7em;
}
</style>
