<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useApp } from '@/microcosm/stores'
import SidebarLink from './SidebarLink.vue';
import { sanitizeMicrocosmURI, isValidMicrocosmURI } from '@/microcosm/core/utils';
import Tooltip from '@/views/spatial/components/Tooltip.vue';
import Icon from '../icon/Icon.vue';

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
    const target = event.target as HTMLInputElement
    newMicrocosmName.value = sanitizeMicrocosmURI(target.value)
    if (event.key === 'Enter') {
        createMicrocosm()
        target.blur()
    }
}

const route = useRoute()

const isRoute = (params: string | string[], uri: string) =>
    Array.isArray(params) ? params.join('') === uri : params === uri
</script>

<template>
    <nav :class="{ open: app.sidebarOpen }">
        <div>
            <div>
                <input v-model="app.identity.username" placeholder="Anonymous" autocapitalize="false" spellcheck="false"
                    autocomplete="false" />
            </div>
            <input :value="newMicrocosmName" @keypress="handleInput" :placeholder="props.placeholder" autocapitalize="false"
                spellcheck="false" autocomplete="false" />
            <button @click="createMicrocosm" v-if="!!newMicrocosmName">Create microcosm</button>
        </div>
        <div>
            <ul>
                <li v-for="{ microcosm_uri } of app.microcosms" v-bind:key="`microcosm-${microcosm_uri}`">
                    <SidebarLink :microcosm_uri="microcosm_uri" v-if="microcosm_uri"
                        :active="isRoute(route.params.microcosm_uri, microcosm_uri)" />
                </li>
            </ul>
        </div>
    </nav>
    <Tooltip key-command="S" :tooltip="`${app.sidebarOpen ? 'Hide' : 'Show'} sidebar`" side="bottom" :align="'start'">
        <button class="menu-toggle" @click="app.sidebarOpen = !app.sidebarOpen">
            <Icon type="stack" :size="40" />My microcosms
        </button>
    </Tooltip>
</template>

<style scoped>
nav {
    position: fixed;
    width: var(--app-sidebar-width);
    top: 0;
    left: 0;
    height: calc(100vh);
    padding: 10px;
    padding-top: 70px;
    z-index: 99;
    background: white;
    color: black;
    border-radius: 2px;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
    transform: translate(-100%);
    transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
}

nav.open {
    transform: translate(0);

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

button.menu-toggle {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 100;
    cursor: pointer;
    background: white;
    height: 30px;
    padding: 2px 12px 2px 2px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
    font-weight: 500;
    font-size: 12px;
}

button.menu-toggle > svg {
    margin-right: 4px;
}

button.menu-toggle:hover {
    background: black;
    color: white;
}
</style>