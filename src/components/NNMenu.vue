<script setup lang="ts">
import { useMicrocosmsStore } from '@/stores/microcosm';
import { ref } from 'vue';
import { kebabCase } from 'scule'

const store = useMicrocosmsStore()

const newMicrocosmName = ref()

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Join microcosm'
    }
})

const handleInput = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        store.setActiveMicrocosm(kebabCase(newMicrocosmName.value), true)
        newMicrocosmName.value = ''
    }
}
</script>

<template>
    <nav>
        <input v-model="newMicrocosmName" @keypress="handleInput" :placeholder="props.placeholder">
        <ul>
            <li v-for="[microcosm_id, microcosm] in store.microcosms" v-bind:key="microcosm_id">
                <router-link :class="{ link: true, active: microcosm_id === store.activeMicrocosm }"
                    :to="{ name: 'microcosm', params: { microcosm_id } }">
                    {{ microcosm.microcosm_id }}
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
nav {
    position: fixed;
    width: 200px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 10px;
    z-index: 5;
    background: white;
    color: black;
    top: 20px;
    right: 20px;
}

input {
    border: initial;
    background: rgba(0, 0, 0, 0.05);
    border: 2px solid rgba(0, 0, 0, 0.1);
    padding: 2px 5px;
    width: 100%;
    border-radius: 2px;
}

ul,
li {
    list-style: none;
    padding: 0;
    margin: 0;
}

.link {
    padding: 5px;
    display: block;
}

.active {
    background: black;
    color: white;
}
</style>