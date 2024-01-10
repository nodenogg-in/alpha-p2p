<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core'

const element = ref<HTMLTextAreaElement>();

const props = defineProps({
    autoFocus: {
        type: Boolean,
        default: false
    },
    value: {
        type: String,
        required: true
    },
    onChange: {
        type: Function,
        required: true

    },
    onCancel: {
        type: Function
    },
    placeholder: {
        type: String,
        default: "Type your thoughts and ideas here!"
    }
})

onMounted(() => {
    if (props.autoFocus) {
        element.value?.focus()
    }
})

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.onCancel) {
        props.onCancel()
    }
}

if (props.onCancel) {
    onClickOutside(element, () => props.onCancel && props.onCancel())
}

const handleInput = (event: Event) => {
    const target = (event.target as HTMLTextAreaElement)
    props.onChange(target.value)
}

</script>

<template>
    <textarea ref="element" :value="props.value" @input="handleInput" @keyup="handleKeyUp" :class="{ scrollable: true }"
        :placeholder="props.placeholder" />
</template>

<style scoped>
textarea {
    position: absolute;
    top: 0;
    left: 0;
    border: initial;
    padding: 10px;
    font: inherit;
    /* font-family: Andale Mono; */
    width: 100%;
    height: 100%;
    outline: none;
    background: initial;
    border-radius: none;
    resize: none;
    line-height: 1.4em;
    margin: 0;
}
</style>