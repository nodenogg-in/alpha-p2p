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

const view = useCurrentSpatialView()
</script>

<template>
    <div class="toolbar">
        <ToolButton :active="isSelectTool(view.tool)" tooltip="Select" keyCommand="V" @click="view.setTool(Tool.Select)">
            <Icon type="select" :size="30" />
        </ToolButton>
        <ToolButton :active="isMoveTool(view.tool)" tooltip="Move" keyCommand="H" @click="view.setTool(Tool.Move)">
            <Icon type="move" :size="30" />
        </ToolButton>
        <ToolButton :active="isNewTool(view.tool)" tooltip="New node" keyCommand="N" @click="view.setTool(Tool.New)">
            <Icon type="newNode" :size="30" />
        </ToolButton>
    </div>
</template>

<style scoped>
div.toolbar {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: white;
    border-radius: 10px;
    z-index: 10;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
    /* padding: 10px; */
    display: grid;
    /* grid-column-gap: 10px; */
    grid-template-columns: repeat(3, 1fr);
}

button {
    font: inherit;
    width: 40px;
    height: 40px;
}
</style>
@/components/icon/Icon.vue