<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useApp } from '@/microcosm/stores'
import MicrocosmLink from './AppMicrocosmLink.vue';
import { sanitizeMicrocosmURI, isValidMicrocosmURI } from '@/microcosm/core/utils';

const app = useApp()
const newMicrocosmName = ref<string>('')

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Join microcosm'
    }
})

const router = useRouter()

const createMicrocosm = () => {
    if (isValidMicrocosmURI(newMicrocosmName.value)) {
        router.push({
            name: 'microcosm',
            params: {
                view: 'spatial',
                microcosm_uri: newMicrocosmName.value
            }
        })
        newMicrocosmName.value = ''
    }
}

const handleInput = (event: KeyboardEvent) => {
    newMicrocosmName.value = sanitizeMicrocosmURI((event.target as HTMLInputElement).value)
    if (event.key === 'Enter') {
        createMicrocosm()
    }
}

const route = useRoute()

const isRoute = (params: string | string[], uri: string) =>
    Array.isArray(params) ? params.join('') === uri : params === uri
</script>

<template>
    <nav>
        <div>
            <div>
                <input v-model="app.identity.username" placeholder="Anonymous" />
            </div>
            <input :value="newMicrocosmName" @keypress="handleInput" :placeholder="props.placeholder" />
            <button @click="createMicrocosm" v-if="!!newMicrocosmName">Create microcosm</button>
        </div>
        <div>
            <ul>
                <li v-for="{ microcosm_uri } of app.microcosms" v-bind:key="`microcosm-${microcosm_uri}`">
                    <MicrocosmLink :microcosm_uri="microcosm_uri"
                        :active="isRoute(route.params.microcosm_uri, microcosm_uri)" />
                </li>
            </ul>
        </div>
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
    bottom: 20px;
    right: 20px;
}

input {
    border: initial;
    background: rgba(0, 0, 0, 0.05);
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


div {
    padding-bottom: 10px;
}
</style>