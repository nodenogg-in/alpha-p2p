
<script setup lang="ts">
import { ref } from 'vue'
import { parseFileToHTMLString } from '@/utils/parse-file'
import { useCurrentMicrocosm, defaultNodeSize } from '@/stores/use-microcosm';
import ContextMenu, { type ContextMenuOption } from '@/components/ContextMenu.vue'
import { useApp } from '@/stores/use-app';
import { isString } from '@/utils';

const active = ref<boolean>(false)
let inActiveTimeout: ReturnType<typeof setTimeout>

const app = useApp()
const microcosm = useCurrentMicrocosm()

const setActive = () => {
    active.value = true
    clearTimeout(inActiveTimeout)
}

const setInactive = () => {
    inActiveTimeout = setTimeout(() => {
        active.value = false
    }, 50)
}

const onDrop = (e: DragEvent) => {
    if (e.dataTransfer) {
        setInactive()
        // open.value = true
        const files = [...e.dataTransfer.files]

        Promise.all(files.map(parseFileToHTMLString))
            .then((results) => {
                const htmlStrings = results.filter(isString)

                htmlStrings.forEach(content => {
                    microcosm.create({
                        type: 'html',
                        content,
                        x: 0,
                        y: 0,
                        ...defaultNodeSize
                    })
                })
            })
    }
}

const options: ContextMenuOption[] = [
    {
        type: "button",
        title: "Delete",
        id: "delete",
        disabled: false
    },
    {
        type: "button",
        title: "Duplicate",
        id: "duplicate",
    }
]

const handleContextMenu = (action: string) => {
    if (action === 'delete') {
        // microcosm.delete(props.node_id)
    } else if (action === 'duplicate') {
        // microcosm.create(node.value)
    }
}

</script>

<template>
    <ContextMenu :options="options" :onClick="handleContextMenu">
        <div :class="{ container: true, active, [app.tool]: true }" :data-active="active" @dragenter.prevent="setActive"
            @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop">
            <!-- <template v-slot:menu>
                <ColorSelectorVue v-if="!remote" :value="node.background_color" :onUpdate="(background_color: string) => {
                    microcosm.update(props.node_id, { background_color })
                }" /> -->
            <slot :dropZoneActive="active"></slot>
        </div>
    </ContextMenu>
</template>

<style scoped>
div.container {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
}

div.move {
    cursor: grab;
}

div.new {
    cursor: crosshair;
}

div.container::after {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.75);
    content: 'Add files';
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    top: 0;
    left: 0;
    position: absolute;
    z-index: 100;
    opacity: 0.0;
}

div.container.active::after {
    pointer-events: initial;
    opacity: 1.0;
}
</style>