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
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const editable = ref(props.editable)
const focusActive = ref(false)

const focus = () => {
  if (!focusActive.value && editor.value) {
    editor.value.setEditable(true)
    editable.value = true
    
    // Only activate focus trap if editor has content that can be focused
    const editorElement = editor.value.view.dom
    if (editorElement) {
      focusActive.value = true
      editor.value.commands.focus('start')
    }
  }
}

const emit = defineEmits(['cancel'])

const onBlur = (/* event: EditorEvents['blur']*/) => {
  editor.value?.commands.blur()
  editor.value?.setEditable(false)
  editable.value = false
  focusActive.value = false
  
  // Call the onCancel prop if provided
  props.onCancel && props.onCancel()
  
  // Emit cancel event
  emit('cancel')
}

const onClick = () => {
  // Only try to activate if we're allowed to based on props
  if (!active.value && props.editable) {
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
  editable: false, // Start with editable false and set it properly after initialization
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
  // After the editor is mounted, we can safely set its editable state
  if (editor.value) {
    // First set the editor's editable state
    editor.value.setEditable(props.editable)
    
    // If editable is true, focus the editor
    if (props.editable) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        focus()
      }, 0)
    }
  }
})

// Watch for changes to the editable state from the ref
watch(editable, (newValue) => {
  if (newValue) {
    editor.value?.setEditable(true)
    focus()
  } else {
    editor.value?.setEditable(false)
  }
})

// Watch for changes to the editable prop
watch(() => props.editable, (newValue) => {
  editable.value = newValue
  if (newValue) {
    editor.value?.setEditable(true)
    focus()
  } else {
    editor.value?.setEditable(false)
  }
})

onBeforeUnmount(() => {
  // Clean up
  editor.value?.commands.blur()
  editor.value?.setEditable(false)
})

const active = computed(() => editable.value && focusActive.value)
</script>

<template>
  <FocusTrap v-model:active="focusActive" :disabled="!editor || !editable.value">
    <div class="wrapper" :class="{ 'is-active': active }" @click="onClick">
      <!-- <EditorMenu :editor="editor" v-if="editor" :blur="onBlur" /> -->
      <Scrollable :scroll="scroll">
        <editor-content :editor="editor" class="tiptap-wrapper" />
      </Scrollable>
    </div>
  </FocusTrap>
</template>

<style>
.wrapper {
  width: 100%;
  height: 100%;
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

.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--ui-50);
  pointer-events: none;
  height: 0;
}

.tiptap .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--ui-50);
  pointer-events: none;
  height: 0;
}
</style>
