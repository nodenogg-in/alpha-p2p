<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { StarterKit } from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { HardBreak } from '@tiptap/extension-hard-break'

import { type PropType, onMounted } from 'vue'
import EditorMenu from './EditorMenu.vue'
import Scrollable from './Scrollable.vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  onChange: {
    type: Function as PropType<(html: string) => void>,
    required: true
  },
  autoFocus: {
    type: Boolean
  },
  editable: {
    type: Boolean,
    default: true
  },
  onCancel: {
    type: Function as PropType<() => void>
  }
})

const editor = useEditor({
  editable: props.editable,
  extensions: [
    StarterKit,
    TaskList,
    TaskItem,
    HardBreak,
    Link.configure({
      linkOnPaste: true
    })
  ],
  injectCSS: false,
  content: props.value,
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    props.onChange(html)
  },
  onBlur: () => {
    props.onCancel && props.onCancel()
  }
})

onMounted(() => {
  if (props.autoFocus) {
    editor.value?.commands.focus('start')
  }
})

</script>

<template>
  <EditorMenu :editor="editor" v-if="editor" />
  <Scrollable>
    <editor-content :editor="editor" class="tiptap-wrapper" />
  </Scrollable>
</template>

<style>
.tiptap-wrapper {
  outline: none;
}

.tiptap {
  outline: none;
  padding: 10px;

}
</style>

