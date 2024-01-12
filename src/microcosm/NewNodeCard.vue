<script setup lang="ts">
import { ref } from 'vue';
import HTMLEditor from '../components/editor/HTMLEditor.vue'
import { localRef } from '@/utils/local-storage';
import { string } from 'valibot';

const props = defineProps({
    onSubmit: {
        type: Function,
        required: true
    }
})

const message = localRef('new_node_content', string(), '')

const handleSubmit = () => {
    if (message.value) {
        props.onSubmit(message.value)
        console.log('setting to nothing')
        message.value = ''
    }
}

document.addEventListener('keydown', (event) => {
    if (event.metaKey && event.key == 'Enter') {
        handleSubmit()
    }
})
</script>

<template>
    <div class="new-node">
        <HTMLEditor :value="message" :onChange="(v: string) => message = v" />
        <button @click="handleSubmit">Add</button>
    </div>
</template>

<style scoped>
div.new-node {
    position: relative;
    display: block;
    width: 300px;
    height: 200px;
    list-style: none;
    margin: 0;
    background-color: var(--card-neutral);
}

button {
    position: absolute;
    bottom: 5px;
    right: 5px;
    z-index: 1;
    cursor: pointer;
}
</style>
