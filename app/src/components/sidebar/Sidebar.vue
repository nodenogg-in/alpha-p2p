<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useApp } from '@/state'
import SidebarLink from './SidebarLink.vue';
import { sanitizeMicrocosmURI, isValidMicrocosmURI } from 'nodenoggin-core/utils';
import { paramToString } from '@/utils/hooks/use-route-microcosms';
import Input from '../Input.vue';
import SidebarTrigger from './SidebarTrigger.vue';

const app = useApp()
const newMicrocosmName = ref<string>('')
const router = useRouter()

const createMicrocosm = () => {
    if (isValidMicrocosmURI(newMicrocosmName.value)) {
        router.push({
            name: 'microcosm',
            params: {
                view: 'spatial',
                microcosm_uri: sanitizeMicrocosmURI(newMicrocosmName.value)
            }
        })
    }
}

const handleInput = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement
    newMicrocosmName.value = sanitizeMicrocosmURI(target.value)
    if (event.key === 'Enter') {
        createMicrocosm()
        newMicrocosmName.value = ''
        target.blur()
    }
}

const handleUsername = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement
    app.identity.username = target.value
}


const route = useRoute()

const isRoute = (params: string | string[], uri: string) =>
    paramToString(params) === uri

</script>

<template>
    <nav :class="{ open: app.sidebarOpen }">
        <div>
            <label for="username">Username</label>
            <Input id="username" :value="app.identity.username" @input="handleUsername" placeholder="Anonymous" />
            <!-- <Button @click="createMicrocosm" v-if="!!newMicrocosmName">Create microcosm</Button> -->
        </div>
        <ul>
            <li class="input">
                <Input :value="newMicrocosmName" @input="handleInput" placeholder="Join microcosm" />
            </li>
            <li v-for="{ microcosm_uri } of app.microcosms" v-bind:key="`microcosm-${microcosm_uri}`">
                <SidebarLink :microcosm_uri="microcosm_uri" v-if="microcosm_uri"
                    :active="isRoute(route.params.microcosm_uri, microcosm_uri)" />
            </li>
        </ul>
    </nav>
    <SidebarTrigger />
</template>

<style scoped>
nav {
    position: fixed;
    width: var(--app-sidebar-width);
    top: 0;
    left: 0;
    height: 100vh;
    max-height: calc(100vh);
    padding-top: 55px;
    z-index: 99;
    color: var(--ui-10);
    background: var(--ui-100);
    box-shadow: var(--ui-shadow-10);
    border-radius: var(--ui-radius);
    transform: translate(-100%);
    transition: transform 0.4s var(--easing);
}

@media (prefers-color-scheme: dark) {
    nav {
        background: var(--ui-90);
        box-shadow: initial;
    }
}


nav.open {
    transform: translate(0);

}

ul,
li {
    list-style: none;
    padding: 0;
    margin: 0;
}

ul {
    padding: 4px;
}

li {
    margin-bottom: 1px;
}

li.input {
    padding: 4px;
}

div {
    padding: 10px;
    display: grid;
    grid-row-gap: 4px;
}

label {
    font-size: 0.8rem;
    color: var(--ui-50);
}
</style>