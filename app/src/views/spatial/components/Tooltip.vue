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
        type: String,
        required: true
    },
    side: {
        type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
        default: 'top'
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
            <TooltipContent class="tooltip-content" :side-offset="5" :side="props.side">
                {{ props.tooltip
                }}<span class="command" v-if="props.keyCommand">{{ props.keyCommand }}</span>
            </TooltipContent>
        </TooltipPortal>
    </TooltipRoot>
</template>

<style>
.tooltip-content {
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
    background-color: white;
    color: black;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    user-select: none;
    z-index: 1000;
    animation-duration: 400ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-name: slideUpAndFade;

    will-change: transform, opacity;
}

/* .tooltip-content[data-state='delayed-open'][data-side='top'] {
    animation-name: slideDownAndFade;
}

.tooltip-content[data-state='delayed-open'][data-side='right'] {
    animation-name: slideLeftAndFade;
}

.tooltip-content[data-state='delayed-open'][data-side='bottom'] {
    animation-name: slideUpAndFade;
}

.tooltip-content[data-state='delayed-open'][data-side='left'] {
    animation-name: slideRightAndFade;
} */

.command {
    opacity: 0.5;
    margin-left: 0.5em;
}

.command.mini {
    /* opacity: 0.25; */
    position: absolute;
    bottom: 4px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
}


@keyframes slideUpAndFade {
    from {
        opacity: 0;
        transform: translateY(2px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideRightAndFade {
    from {
        opacity: 0;
        transform: translateX(-2px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideDownAndFade {
    from {
        opacity: 0;
        transform: translateY(-2px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideLeftAndFade {
    from {
        opacity: 0;
        transform: translateX(2px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
