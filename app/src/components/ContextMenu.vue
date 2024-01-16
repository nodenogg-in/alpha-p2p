<script setup lang="ts">
import { type PropType } from 'vue'
import {
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuPortal,
    ContextMenuRoot,
    ContextMenuTrigger,
    ContextMenuSeparator
} from 'radix-vue'

export type ContextMenuOption = {
    type: 'button'
    id: string
    title: string
    command?: string
    disabled?: boolean
    separator?: boolean
}

const props = defineProps({
    onClick: {
        type: Function as PropType<(opt: string) => void>,
        required: true
    },
    onToggle: {
        type: Function as PropType<(open: boolean) => void>
    },
    options: {
        type: Array as PropType<ContextMenuOption[]>,
        required: true
    }
})

const handleClick = (v: string) => {
    if (props.onToggle) props.onToggle(false)
    props.onClick(v)
}

</script>

<template>
    <ContextMenuRoot @update:open="onToggle">
        <ContextMenuTrigger as-child>
            <slot></slot>
        </ContextMenuTrigger>
        <ContextMenuPortal>
            <ContextMenuContent :class="{ 'menu-context': true }" :side-offset="5">
                <ContextMenuItem :value="'color'">
                    <slot name="menu"></slot>
                </ContextMenuItem>

                <ContextMenuItem v-for=" option in props.options " :value="option.id" class="context-menu-item"
                    :key="option.id" @click="() => handleClick(option.id)" :disabled="option.disabled">
                    {{ option.title }}
                    <div v-if="option.command" class="right-slot">
                        {{ option.command }}
                    </div>
                    <ContextMenuSeparator class="ContextMenuSeparator" v-if="option.separator" />
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenuPortal>
    </ContextMenuRoot>
</template>

<style>
.menu-context {
    min-width: 220px;
    border-radius: 6px;
    overflow: hidden;
    padding: 5px;
    background: white;
    box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
}

.context-menu-item {
    font-size: 13px;
    line-height: 1;
    color: var(--grass-11);
    border-radius: 3px;
    display: flex;
    align-items: center;
    height: 25px;
    padding: 0 5px;
    position: relative;
    user-select: none;
    outline: none;
    border: 0;
}

.context-menu-item[data-disabled] {
    opacity: 0.1;
    pointer-events: none;
}

.context-menu-item[data-highlighted] {
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--grass-1);
}

.ContextMenuLabel {
    padding-left: 25px;
    font-size: 12px;
    line-height: 25px;
    color: var(--mauve-11);
}

.ContextMenuSeparator {
    height: 1px;
    background-color: var(--grass-6);
    margin: 5px;
}

.right-slot {
    margin-left: auto;
    padding-left: 20px;
    color: var(--mauve-11);
}

[data-highlighted]>.right-slot {
    color: currentColor;
    /* color: white; */
}

[data-disabled] .right-slot {
    color: var(--mauve-8);
}
</style>