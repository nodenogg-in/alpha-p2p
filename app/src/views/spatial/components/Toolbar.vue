<script setup lang="ts">
import ToolButton from './ToolButton.vue'
import Icon from '@/components/icon/Icon.vue'
import { useCurrentSpatialView } from '@/views/spatial'
import { Tool } from 'nodenoggin/spatial';

const view = useCurrentSpatialView()
</script>

<template>
    <div class="toolbar">
        <ToolButton :active="view.tool === Tool.Select" tooltip="Select" :keyCommand="['v']"
            @click="view.setTool(Tool.Select)">
            <Icon type="select" />
        </ToolButton>
        <ToolButton :active="view.tool === Tool.Move" tooltip="Move" :keyCommand="['h']" @click="view.setTool(Tool.Move)">
            <Icon type="move" />
        </ToolButton>
        <ToolButton :active="view.tool === Tool.New" tooltip="New node" :keyCommand="['n']" @click="view.setTool(Tool.New)">
            <Icon type="newNode" />
        </ToolButton>
        <ToolButton :active="view.tool === Tool.Connect" tooltip="Connect" :keyCommand="['c']"
            @click="view.setTool(Tool.Connect)">
            <Icon type="connect" />
        </ToolButton>
    </div>
</template>

<style scoped>
div.toolbar {
    position: absolute;
    left: calc(50% - 100px);
    bottom: 10px;
    z-index: 200;
    background: var(--ui-100);
    box-shadow: var(--ui-shadow-10);
    border-radius: var(--ui-radius);
    width: 200px;
    display: flex;
}

@media (prefers-color-scheme: dark) {
    div.toolbar {
        background: var(--ui-90);
    }
}
</style>
