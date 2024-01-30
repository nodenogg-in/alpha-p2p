<script setup lang="ts">
import ToolButton from './ToolButton.vue'
import Icon from '@/components/icon/Icon.vue'
import {
    useCurrentSpatialView,
    Tool,
    isSelectTool,
    isMoveTool,
    isNewTool
} from '@/views/spatial'
import { isConnectTool } from '../stores/use-spatial-view';

const view = useCurrentSpatialView()
</script>

<template>
    <div class="toolbar">
        <ToolButton :active="isSelectTool(view.tool)" tooltip="Select" keyCommand="V" @click="view.setTool(Tool.Select)">
            <Icon type="select" />
        </ToolButton>
        <ToolButton :active="isMoveTool(view.tool)" tooltip="Move" keyCommand="H" @click="view.setTool(Tool.Move)">
            <Icon type="move" />
        </ToolButton>
        <ToolButton :active="isNewTool(view.tool)" tooltip="New node" keyCommand="N" @click="view.setTool(Tool.New)">
            <Icon type="newNode" />
        </ToolButton>
        <ToolButton :active="isConnectTool(view.tool)" tooltip="Connect" keyCommand="C" @click="view.setTool(Tool.Connect)">
            <Icon type="connect" />
        </ToolButton>
    </div>
</template>

<style scoped>
div.toolbar {
    position: absolute;
    left: calc(50% - 100px);
    /* left: 10px; */
    bottom: 10px;
    z-index: 10;
    background: var(--ui-100);
    box-shadow: var(--ui-shadow);
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
