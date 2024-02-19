<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { StarterKit } from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { HardBreak } from '@tiptap/extension-hard-break'
import { FocusTrap } from 'focus-trap-vue'

import { type PropType, onMounted, ref, onBeforeUnmount, watch, computed } from 'vue'
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
  editable: {
    type: Boolean
  },
  onCancel: {
    type: Function as PropType<() => void>
  },
  scroll: {
    type: Boolean
  }

})

const focusActive = ref(false)

const focus = () => {
  if (!focusActive.value) {
    editor.value?.setEditable(true)
    focusActive.value = true
    editor.value?.commands.focus('start')
  }
}

const blur = () => {
  editor.value?.setEditable(false)
  focusActive.value = false
  props.onCancel && props.onCancel()
}

console.log('editable', props.editable)
const editor = useEditor({
  editable: props.editable,
  extensions: [
    StarterKit,
    TaskList,
    TaskItem,
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
  onBlur: () => blur()
})

onMounted(() => {
  if (props.editable) {
    focus()
  }
})

watch(props, () => {
  if (props.editable) {
    focus()
  }
})

onBeforeUnmount(() => {
  blur()
})

const active = computed(() => props.editable && focusActive.value)
</script>

<template>
  <FocusTrap v-model:active="focusActive">
    <div class="wrapper">
      <EditorMenu :editor="editor" v-if="editor && active" />
      <Scrollable :active="props.scroll">
        <editor-content :editor="editor" class="tiptap-wrapper" />
      </Scrollable>
    </div>
  </FocusTrap>
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

