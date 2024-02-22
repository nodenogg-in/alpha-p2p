<script setup lang="ts">
import { ToolbarButton, ToolbarRoot } from 'radix-vue'
import { ref, type PropType } from 'vue'
import type { Editor } from '@tiptap/vue-3';
import Select from '../select/Select.vue'
import SelectItem from '../select/SelectItem.vue'
import Button from '../Button.vue';

const props = defineProps({
    editor: {
        type: Object as PropType<Editor>,
        required: true
    }
})

const setLink = () => {
    const { editor } = props
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
        return
    }

    if (url === '') {
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .unsetLink()
            .run()

        return
    }

    editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
}

const s = ref('h1')

</script>

<template>
    <ToolbarRoot class="editor-toolbar" aria-label="Formatting options">
        <Select v-model="s" placeholder="Heading" label="Choose heading">
            <SelectItem text="h1" />
            <SelectItem text="h2" />
            <SelectItem text="h3" />
            <SelectItem text="h4" />
            <SelectItem text="h5" />
            <SelectItem text="h6" />
            <SelectItem text="p" />
        </Select>
        <ToolbarButton as-child>
            <Button :disabled="!editor.can().setItalic()" @click="editor?.chain().focus().toggleItalic().run()">I</Button>
        </ToolbarButton>
        <ToolbarButton as-child>
            <Button :disabled="!editor.can().setBold()" @click="editor?.chain().focus().toggleBold().run()">B</Button>
        </ToolbarButton>
        <ToolbarButton as-child>
            <Button @click="setLink" v-if="editor.can().setLink()" :class="{ 'is-active': editor.isActive('link') }">Set
                link</Button>
        </ToolbarButton>
        <ToolbarButton as-child>
            <Button v-if="editor.can().unsetLink()" @click="editor.chain().focus().unsetLink().run()"
                :disabled="!editor.isActive('link')">Unset
                link</Button>
        </ToolbarButton>

        <!-- <ToolbarToggleItem as-child aria-label="Bold" value="bold">
            <Button :disabled="!editor?.can().setBold()" @click="editor?.chain().focus().toggleBold().run()">B</Button>
        </ToolbarToggleItem> -->
        <!-- <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
            setLink
        </button>
        <button @click="editor.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
            unsetLink
        </button> -->

    </ToolbarRoot>
</template>

<style>
.editor-toolbar {
    min-width: max-content;
    position: absolute;
    top: calc(var(--size-48) * -1);
    left: 0;
    gap: var(--size-4);
    display: flex;
    justify-content: center;
    transform: translateY(calc(var(--size-24) * -1)) scale(calc(1.0 / var(--spatial-view-scale)));
    transform-origin: 0% 100%;
    background: var(--ui-100);
    border-radius: var(--ui-radius);
    padding: var(--size-8);
    z-index: 10;
}

/* @media (prefers-color-scheme: dark) {
    .editor-toolbar {
        background: var(--ui-90);
    }
} */
</style>