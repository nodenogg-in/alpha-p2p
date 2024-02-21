<script setup lang="ts">
import ToolButton from './ToolButton.vue'
import Icon from '@/components/icon/Icon.vue'
import { useCurrentSpatialView } from '@/views/spatial'
import { Tool } from 'nodenoggin/spatial';

const view = useCurrentSpatialView()
</script>

<template>
    <div class="toolbar">
        <ToolButton :active="view.action.tool === Tool.Select" tooltip="Select" :keyCommand="['v']"
            @click="view.actions.setTool(Tool.Select)">
            <Icon type="select" />
        </ToolButton>
        <ToolButton :active="view.action.tool === Tool.Move" tooltip="Move" :keyCommand="['h']"
            @click="view.actions.setTool(Tool.Move)">
            <Icon type="move" />
        </ToolButton>
        <ToolButton :active="view.action.tool === Tool.New" tooltip="New node" :keyCommand="['n']"
            @click="view.actions.setTool(Tool.New)">
            <Icon type="newNode" />
        </ToolButton>
        <ToolButton :active="view.action.tool === Tool.Connect" tooltip="Connect" :keyCommand="['c']"
            @click="view.actions.setTool(Tool.Connect)">
            <Icon type="connect" />
        </ToolButton>
    </div>
</template>

<style scoped>
div.toolbar {
    position: absolute;
    z-index: 200;
    background: var(--ui-100);
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
        box-shadow: var(--ui-shadow-25);
        background: var(--ui-90);
    }
}
</style>
