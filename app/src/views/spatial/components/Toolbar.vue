<script setup lang="ts">
import { useApp, Tool } from '@/stores/use-app';
import ToolButton from './ToolButton.vue';
import Icon from '@/components/Icon/Icon.vue'
const app = useApp()

const setTool = (a: Tool) => {
    app.tool = a
}
</script>

<template>
    <div class="toolbar">
        <ToolButton :active="app.tool === Tool.Select" tooltip="Select" keyCommand="V" @click="() => setTool(Tool.Select)">
            <Icon type="select" :size="30" />
        </ToolButton>
        <ToolButton :active="app.tool === Tool.Move" tooltip="Move" keyCommand="H" @click="() => setTool(Tool.Move)">
            <Icon type="move" :size="30" />
        </ToolButton>
        <ToolButton :active="app.tool === Tool.New" tooltip="New node" keyCommand="N" @click="() => setTool(Tool.New)">
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