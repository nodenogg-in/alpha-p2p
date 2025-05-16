<script setup lang="ts">
import { type PropType, onMounted, ref, onBeforeUnmount, watch, computed } from 'vue'
import { FocusTrap } from 'focus-trap-vue'
import { useEditor, EditorContent, type EditorEvents } from '@tiptap/vue-3'
import EditorMenu from './EditorMenu.vue'
import Scrollable from './Scrollable.vue'
import { extensions } from './tiptap-editor'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  onChange: {
    type: Function as PropType<(html: string) => void>,
    required: true
  },
  onCancel: {
    type: Function as PropType<() => void>
  },
  scroll: {
    type: Boolean
  }
})

const editable = ref(false)
const focusActive = ref(false)

const focus = () => {
  if (!focusActive.value) {
    editor.value?.setEditable(true)
    editable.value = true
    focusActive.value = true
    editor.value?.commands.focus('start')
  }
}

const onBlur = (/* event: EditorEvents['blur']*/) => {
  editor.value?.commands.blur()
  editor.value?.setEditable(false)
  editable.value = false
  focusActive.value = false
  props.onCancel && props.onCancel()
}

const onClick = () => {
  if (!active.value) {
    editable.value = true
    focus()
  }
}

const onUpdate = ({ editor }: EditorEvents['update']) => {
  const html = editor.getHTML()
  if (html !== props.value) {
    props.onChange(html)
  }
}

const editor = useEditor({
  editable: editable.value,
  extensions,
  injectCSS: false,
  content: props.value,
  onUpdate,
  onBlur,
})

watch(() => props.value, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue)
  }
})

onMounted(() => {
  if (editable.value) {
    focus()
  }
})

watch(editable, (newValue) => {
  if (newValue) {
    editor.value?.setEditable(true)
    focus()
  } else {
    editor.value?.setEditable(false)
  }
})

onBeforeUnmount(() => {
  blur()
})

const active = computed(() => editable.value && focusActive.value)
</script>

<template>
  <FocusTrap v-model:active="focusActive">
    <div class="wrapper" :class="{ 'is-active': active }" @click="onClick">
      <!-- <EditorMenu :editor="editor" v-if="editor && active" :blur="onBlur" /> -->
      <Scrollable :scroll="scroll">
        <editor-content :editor="editor" class="tiptap-wrapper" />
      </Scrollable>
    </div>
  </FocusTrap>
</template>

<style>
.wrapper {
  width: 100%;
  border: 2px solid transparent;
  border-radius: var(--ui-radius);
  transition: border-color 0.2s ease;
}

.wrapper.is-active {
  border-color: var(--ui-primary-100);
}

.tiptap-wrapper {
  outline: none;
}

.tiptap {
  white-space: pre-wrap;
  outline: none;
  padding: var(--size-12);
}

/* Placeholder (at the top) */
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

/* Placeholder (on every new line) */
.tiptap .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}
</style>
