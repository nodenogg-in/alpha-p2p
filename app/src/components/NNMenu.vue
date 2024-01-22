<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApp } from '@/stores/use-app';

const app = useApp()
const newMicrocosmName = ref()

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Join microcosm'
    }
})

const router = useRouter()

const createMicrocosm = () => {
    router.push({
        name: 'microcosm',
        params: {
            view: 'spatial',
            microcosm_uri: `${newMicrocosmName.value}`,
        }
    })
    newMicrocosmName.value = ''
}

const handleInput = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        createMicrocosm()
    }
}

const route = useRoute()


</script>

<template>
    <nav>
        <div>
            <div>
                <input v-model="app.identity.username" placeholder="Anonymous">
            </div>
            <input v-model="newMicrocosmName" @keypress="handleInput" :placeholder="props.placeholder">
            <button @click="createMicrocosm" v-if="!!newMicrocosmName">Create microcosm</button>
        </div>
        <div>
            <p>Microcosms</p>
            <ul>
                <li v-for="[microcosm_uri] in app.microcosms" v-bind:key="`microcosm-${microcosm_uri}`">
                    <router-link :class="{ link: true, active: route.params.microcosm_uri === microcosm_uri }" :to="{
                        name: 'microcosm',
                        params: {
                            view: 'spatial',
                            microcosm_uri
                        }
                    }">
                        {{ microcosm_uri }}
                    </router-link>

                    <!-- <details open>
                        <summary>{{ namespace }}</summary>
                        <ul>
                            <li v-for="microcosm in microcosms" v-bind:key="microcosm.uri">
                                <router-link :class="{ link: true, active: false }" :to="{
                                    name: 'microcosm_demo',
                                    params: {
                                        microcosm_uri: microcosm.uri
                                    }
                                }">
                                    {{ microcosm.uri }}
                                </router-link>
                            </li>
                        </ul>

                    </details> -->
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
    border-radius: 4px;
    padding: 3px 6px;
    display: block;
    cursor: pointer;
}

.active {
    background: rgba(50, 50, 255, 0.2);
    color: rgba(50, 50, 255, 1);

    /* background: rgba(0, 0, 0, 0.2); */
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

li {
    font-variation-settings: 'wght' 800.0;
}

/* li {
    height: 2.5em;
    padding-left: 0.5em;
} */
</style>