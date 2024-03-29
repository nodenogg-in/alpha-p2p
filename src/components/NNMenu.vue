<script setup lang="ts">
import { ref } from 'vue';
import { kebabCase } from 'scule'
import { useRouter } from 'vue-router';
import { useAppState } from '@/stores/use-app-state';
import { useSettings } from '@/stores/use-settings';

const app = useAppState()
const settings = useSettings()
const newMicrocosmName = ref()

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Join microcosm'
    }
})

const router = useRouter()

const createMicrocosm = () => {
    if (settings.namespace) {
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

const handleInput = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        createMicrocosm()
    }
}


</script>

<template>
    <nav>
        <div>
            <p>Identity</p>
            <label>Username</label>
            <input v-model="app.identity.meta.username" placeholder="Username">
            <label>UID</label>
            <input :value="app.identity.user.user_id" disabled />
        </div>
        <div>
            <p>Join microcosm</p>
            <label>Namespace</label>
            <input v-model="settings.namespace" placeholder="Namespace">
            <label>Microcosm ID</label>
            <input v-model="newMicrocosmName" @keypress="handleInput" :placeholder="props.placeholder">
            <button @click="createMicrocosm" v-if="!!newMicrocosmName">Create microcosm</button>
        </div>
        <div>
            <p>Microcosms</p>

            <ul>
                <li v-for="[namespace, microcosms] in app.namespaces" v-bind:key="`namespace-${namespace}`">
                    <details open>
                        <summary>{{ namespace }}</summary>
                        <ul>
                            <li v-for="microcosm in microcosms" v-bind:key="microcosm.uri">
                                <router-link :class="{ link: true, active: app.microcosm?.uri === microcosm.uri }" :to="{
                                    name: 'microcosm',
                                    params: {
                                        microcosm_id: microcosm.microcosm_id,
                                        namespace_id: microcosm.namespace_id
                                    }
                                }">
                                    {{ microcosm.microcosm_id }}
                                </router-link>
                            </li>
                        </ul>

                    </details>
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

details {
    border: 1px solid;
    padding: 0;
    background: white;
}

details+details {
    border-top: none;
}

details[open] {
    padding-bottom: 0;
}

summary {
    display: flex;
    align-items: center;
    height: 2.5em;
    padding-left: 0.5em;
    border: 1px solid red;
    font-weight: bold;
    cursor: pointer;
}

div {
    padding-bottom: 10px;
}

p {
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 11px;
    padding-bottom: 5px;
}

label {
    font-size: 12px;
    color: rgb(100, 100, 100);
}

/* li {
    height: 2.5em;
    padding-left: 0.5em;
} */
</style>@/stores/app@/stores/use-settings