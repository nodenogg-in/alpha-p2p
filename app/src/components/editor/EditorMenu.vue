<script setup lang="ts">
import { ToolbarButton, ToolbarRoot } from 'radix-vue'
import { ref, type PropType } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import Select from '../select/Select.vue'
import SelectItem from '../select/SelectItem.vue'
import Button from '../button/Button.vue'
import { MAX_CHARACTER_COUNT } from '@nodenogg.in/schema'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  },
  blur: {
    type: Function as PropType<() => void>,
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
    editor.chain().focus().extendMarkRange('link').unsetLink().run()

    return
  }

  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const s = ref('h1')
</script>

<template>
  <ToolbarRoot class="editor-toolbar" aria-label="Formatting options">
    <ToolbarButton as-child>
      <Button
        :disabled="!editor.can().setHeading({ level: 1 })"
        @click="editor?.chain().focus().setHeading({ level: 1 }).run()"
        >H1</Button
      >
    </ToolbarButton>
    <ToolbarButton as-child>
      <Button
        :disabled="!editor.can().setHeading({ level: 2 })"
        @click="editor?.chain().focus().setHeading({ level: 2 }).run()"
        >H2</Button
      >
    </ToolbarButton>
    <ToolbarButton as-child>
      <Button
        :disabled="!editor.can().setItalic()"
        @click="editor?.chain().focus().toggleItalic().run()"
        >I</Button
      >
    </ToolbarButton>
    <ToolbarButton as-child>
      <Button
        :disabled="!editor.can().setBold()"
        @click="editor?.chain().focus().toggleBold().run()"
        >B</Button
      >
    </ToolbarButton>
    <ToolbarButton as-child>
      <Button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">Set link</Button>
    </ToolbarButton>
    <ToolbarButton as-child>
      <Button
        v-if="editor.can().unsetLink()"
        @click="editor.chain().focus().unsetLink().run()"
        :disabled="!editor.isActive('link')"
        >Unset link</Button
      >
    </ToolbarButton>
    <ToolbarButton as-child>
      <Button @click="blur">Done</Button>
    </ToolbarButton>

    <span> {{ editor.storage.characterCount.characters() }}/{{ MAX_CHARACTER_COUNT }} </span>
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

  /* top: calc(var(--size-48) * -1); */
  /* top: 0; */
  bottom: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(calc(var(--card-element-scale)));
  transform-origin: 0% 100%;
  /* background: var(--ui-100); */
  border-radius: var(--ui-radius);
  padding: var(--size-8);
  z-index: 10;
  gap: var(--size-4);
}

/* @media (prefers-color-scheme: dark) {
    .editor-toolbar {
        background: var(--ui-90);
    }
} */
</style>
