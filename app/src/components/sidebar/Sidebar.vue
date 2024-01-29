<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useApp } from '@/microcosm/stores'
import SidebarLink from './SidebarLink.vue';
import { sanitizeMicrocosmURI, isValidMicrocosmURI } from '@/microcosm/core/utils';
import Tooltip from '@/views/spatial/components/Tooltip.vue';
import Icon from '../icon/Icon.vue';
import { paramToString } from '@/utils/hooks/use-route-microcosms';
import Button from '../Button.vue';
import Input from '../Input.vue';

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

const route = useRoute()

const isRoute = (params: string | string[], uri: string) =>
    paramToString(params) === uri

</script>

<template>
    <nav :class="{ open: app.sidebarOpen }">
        <div>
            <!-- <Input v-model="app.identity.username" placeholder="Anonymous" /> -->
            <Input :value="newMicrocosmName" @keyup="handleInput" placeholder="Join microcosm" />
            <Button @click="createMicrocosm" v-if="!!newMicrocosmName">Create microcosm</Button>
        </div>
        <ul>
            <li v-for="{ microcosm_uri } of app.microcosms" v-bind:key="`microcosm-${microcosm_uri}`">
                <SidebarLink :microcosm_uri="microcosm_uri" v-if="microcosm_uri"
                    :active="isRoute(route.params.microcosm_uri, microcosm_uri)" />
            </li>
        </ul>
    </nav>
    <Tooltip key-command="S" :tooltip="`${app.sidebarOpen ? 'Hide' : 'Show'} sidebar`" side="right" :align="'center'">
        <Button class="menu-button" @click="app.sidebarOpen = !app.sidebarOpen">
            <Icon type="stack" :size="32" />
            My microcosms
        </Button>
    </Tooltip>
</template>

<style scoped>
nav {
    position: fixed;
    width: var(--app-sidebar-width);
    top: 0;
    left: 0;
    height: calc(100vh);
    padding-top: 55px;
    z-index: 99;
    color: var(--ui-0);
    background: var(--ui-100);
    border-radius: 2px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
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

div {
    padding: 10px;
    display: grid;
    grid-row-gap: 4px;
}

.menu-button {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 100;
}
</style>