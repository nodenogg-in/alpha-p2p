<script setup lang="ts">
import ToolButton from './ToolButton.vue'
import Icon from '@/components/icon/Icon.vue'
import { icons, type IconName } from '@/components/icon/svg';
import { useCurrentSpatialView } from '@/views/spatial'

const spatial = useCurrentSpatialView()
</script>

<template>
    <div class="toolbar">
        <ToolButton v-for="[key, { name, command }] in spatial.tools" :active="spatial.action.tool === key" :tooltip="name"
            :keyCommand="[command]" v-bind:key="`tool-${key}`" @click="spatial.canvas().setTool(key)">
            <Icon v-if="icons[key as IconName]" :type="(key as IconName)" />
        </ToolButton>
    </div>
</template>

<style scoped>
div.toolbar {
    position: absolute;
    z-index: 200;
    background: var(--ui-95);
    box-shadow: var(--ui-shadow-10);
    border-radius: var(--ui-radius);
    inset: 0;
    top: initial;
    bottom: var(--size-12);
    display: flex;
    width: fit-content;
    height: fit-content;
    margin-inline: auto;
}

@media (prefers-color-scheme: dark) {
    div.toolbar {
        /* box-shadow: var(--ui-shadow-25); */
        background: var(--ui-90);
    }
}
</style>
