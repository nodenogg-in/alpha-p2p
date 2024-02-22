<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useApp } from '@/state'
import MenuLink from './MenuLink.vue';
import { sanitizeMicrocosmURI } from 'nodenoggin/utils';
import { paramToString } from '@/state';
import Input from '../input/Input.vue';
import MenuTrigger from './MenuTrigger.vue';
import { useRefineRef } from '@/utils/hooks/use-refine-ref';

const app = useApp()
const newMicrocosmName = useRefineRef('', sanitizeMicrocosmURI)

const handleInput = (event: KeyboardEvent) => {
    newMicrocosmName.value = (event.target as HTMLInputElement).value
}

const handleKeyUp = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement
    if (event.key === 'Enter') {
        app.gotoMicrocosm({ microcosm_uri: newMicrocosmName.value })
        newMicrocosmName.value = ''
        target.blur()
    }
}

const handleUsername = (event: KeyboardEvent) => {
    app.identity.username = (event.target as HTMLInputElement).value
}

const route = useRoute()

const isRoute = (params: string | string[], uri: string) =>
    paramToString(params) === uri

</script>

<template>
    <nav :class="{ open: app.menuOpen }">
        <div>
            <label for="username">Username</label>
            <Input id="username" :value="app.identity.username" @input="handleUsername" placeholder="Anonymous" />
            <!-- <Button @click="createMicrocosm" v-if="!!newMicrocosmName">Create microcosm</Button> -->
        </div>
        <ul>
            <li class="input">
                <Input :value="newMicrocosmName" @input="handleInput" @keyup="handleKeyUp" placeholder="Join microcosm" />
            </li>
            <li v-for="{ microcosm_uri, view } of app.microcosms" v-bind:key="`menu-link-${microcosm_uri}${view}`">
                <MenuLink :microcosm_uri="microcosm_uri" :view="view"
                    :active="isRoute(route.params.microcosm_uri, microcosm_uri)" />
            </li>
        </ul>
    </nav>
    <MenuTrigger />
</template>

<style scoped>
nav {
    position: fixed;
    width: var(--app-menu-width);
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
}

@media (prefers-color-scheme: dark) {
    nav {
        background: var(--ui-100);
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
    padding: var(--size-4);
}

li {
    margin-bottom: 1px;
}

li.input {
    padding: var(--size-4)px;
}

div {
    padding: var(--size-12);
    display: grid;
    grid-row-gap: 4px;
}

label {
    font-size: 0.8rem;
    color: var(--ui-50);
}
</style>