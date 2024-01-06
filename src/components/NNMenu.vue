<script setup lang="ts">
import { ref } from 'vue';
import { kebabCase } from 'scule'
import { useRouter } from 'vue-router';
import { useMicrocosms } from '@/stores/microcosm';
import { useSettings } from '@/stores/settings';

const store = useMicrocosms()
const settings = useSettings()
const newMicrocosmName = ref()

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Join microcosm'
    }
})

const router = useRouter()

const handleInput = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        const microcosm_id = kebabCase(newMicrocosmName.value)
        router.push({
            name: 'microcosm',
            params: {
                namespace_id: settings.namespace,
                microcosm_id
            }
        })

        newMicrocosmName.value = ''
    }
}
</script>

<template>
    <nav>
        <input :value="settings.namespace" @change="(e) => settings.setNamespace((e.target as HTMLInputElement).value)"
            placeholder="Namespace">
        <input v-model="newMicrocosmName" @keypress="handleInput" :placeholder="props.placeholder">
        <ul>
            <li v-for="[uri, microcosm] in store.microcosms" v-bind:key="uri">
                <router-link :class="{ link: true, active: store.activeMicrocosm && uri === store.activeMicrocosm.uri }"
                    :to="{
                        name: 'microcosm',
                        params: {
                            microcosm_id: microcosm.microcosm_id,
                            namespace_id: microcosm.namespace_id
                        }
                    }">
                    {{ microcosm.uri }}
                </router-link>
            </li>
        </ul>
    </nav>
    <div>
        1 peer
    </div>
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

div {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgb(60, 60, 60);
    color: white;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
}
</style>