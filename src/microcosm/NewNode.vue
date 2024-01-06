<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    onSubmit: {
        type: Function,
        required: true
    }
})

const message = ref<string>('')

const handleSubmit = () => {
    if (message.value) {
        props.onSubmit(message.value)
        message.value = ''
    }
}

const handleKeypress = (event: KeyboardEvent) => {
    // if (event.key === 'Enter') {
    //     handleSubmit()
    // }
}
</script>

<template>
    <div>
        <textarea v-model="message" @keypress="handleKeypress" placeholder="New node..." />
        <button @click="handleSubmit">Add</button>
    </div>
</template>

<style scoped>
div {
    display: block;
    width: 300px;
    height: 200px;
    list-style: none;
    padding: 10px;
    margin: 0;
    display: flex;
    flex-direction: column;
    border: 1px dashed black;
}

textarea {
    border: initial;
    padding: 0;
    font: inherit;
    width: 100%;
    height: 100%;
    outline: none;
    border-radius: none;
}
</style>