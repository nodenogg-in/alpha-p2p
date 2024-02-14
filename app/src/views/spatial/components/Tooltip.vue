<script setup lang="ts">
import {
    TooltipContent,
    TooltipPortal,
    TooltipRoot,
    TooltipTrigger
} from 'radix-vue'
import type { PropType } from 'vue';

const props = defineProps({
    keyCommand: {
        type: String
    },
    tooltip: {
        type: String
    },
    side: {
        type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
        default: 'top'
    },
    align: {
        type: String as PropType<'start' | 'center' | 'end'>,
        default: 'center'
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
    <TooltipRoot :delayDuration="30" :disableClosingTrigger="props.disableClosingTrigger">
        <TooltipTrigger as-child>
            <slot></slot>
        </TooltipTrigger>
        <TooltipPortal>
            <TooltipContent class="tooltip-content" :side-offset="5" :side="props.side" :align="props.align">
                {{ props.tooltip
                }}<span class="command" v-if="props.keyCommand">{{ props.keyCommand }}</span>
            </TooltipContent>
        </TooltipPortal>
    </TooltipRoot>
</template>

<style>
.tooltip-content {
    border-radius: var(--ui-radius);
    padding: 4px 6px;
    font-size: 12px;
    color: var(--ui-100);
    background-color: var(--ui-10);
    user-select: none;
    z-index: 1000;
    animation-duration: 400ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-name: animateIn;
    will-change: transform, opacity;
}


@media (prefers-color-scheme: dark) {
    .tooltip-content {
        background: var(--ui-0);
    }
}

.command {
    text-transform: uppercase;
    color: var(--ui-60);
    margin-left: 0.5em;
}

@keyframes animateIn {
    from {
        opacity: 0;
        transform: translateY(2px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
