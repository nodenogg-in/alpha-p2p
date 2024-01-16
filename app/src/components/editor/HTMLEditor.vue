<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

import { type PropType, onMounted } from 'vue';

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
    onCancel: {
        type: Function as PropType<() => void>
    },
})

const editor = useEditor({
    extensions: [StarterKit],
    content: props.value,
    onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        props.onChange(html)
    },
    onBlur: () => {
        props.onCancel && props.onCancel()
    },

})

onMounted(() => {
    if (props.autoFocus) {
        editor.value?.commands.focus('end')
    }
})

// const handleKeyUp = (event: KeyboardEvent) => {
//     if (event.key === 'Escape' && props.onCancel) {
//         props.onCancel()
//     }
// }

// if (props.onCancel) {
//     onClickOutside(element.value, () => {
//         console.log('click outside')
//     })
// }

</script>

<template>
    <editor-content :editor="editor" class="tiptap-wrapper" />
</template>

<style>
.tiptap-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.tiptap {
    padding: 10px;
    width: 100%;
    height: 100%;
    outline: initial;
    overflow: scroll;

    >*+* {}

    ul,
    ol {
        padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
    }

    code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
    }

    pre {
        background: #0D0D0D;
        color: #FFF;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;

        code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: 0.8rem;
        }
    }

    img {
        max-width: 100%;
        height: auto;
    }

    blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0D0D0D, 0.1);
    }

    hr {
        border: none;
        border-top: 2px solid rgba(#0D0D0D, 0.1);
        margin: 2rem 0;
    }
}
</style>