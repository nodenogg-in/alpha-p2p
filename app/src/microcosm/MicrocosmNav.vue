<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarItemIndicator,
    MenubarMenu,
    MenubarPortal,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarRoot,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from 'radix-vue'
import { session, useApp, useCurrentMicrocosm, useCurrentView, views } from '@/state';
import { clamp } from '@nodenogg.in/toolkit';
import Input from '@/components/input/Input.vue';
import Tooltip from '@/views/spatial/components/Tooltip.vue';
import Button from '@/components/button/Button.vue';
import Icon from '@/components/icon/Icon.vue';
import MenubarDivider from './MenubarDivider.vue'
import MenuLink from '@/components/menu/MenuLink.vue';
import { paramToString } from '@/state'
import { useRoute, useRouter } from 'vue-router';
import { useRefineRef } from '@/hooks/use-refine-ref'
import { getMicrososmID } from '@nodenogg.in/microcosm';
import { usePersistedSignal } from '@nodenogg.in/statekit/vue';
import MicrocosmList from './MicrocosmList.vue';
import Dialog from '@/components/dialog/Dialog.vue';

const microcosm = useCurrentMicrocosm()
const view = useCurrentView()
const app = useApp()
const route = useRoute()
const router = useRouter()

const newMicrocosmName = useRefineRef('', getMicrososmID)

const handleInput = (event: KeyboardEvent) => {
    event.stopImmediatePropagation()
    event.stopPropagation()
    newMicrocosmName.value = (event.target as HTMLInputElement).value
}

const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault()
    event.stopPropagation()
}

const handleKeyUp = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement
    if (event.key === 'Enter') {
        router.push({
            name: 'microcosm',
            params: {
                MicrocosmID: newMicrocosmName.value
            }
        })
        newMicrocosmName.value = ''
        target.blur()
    }
}




const isRoute = (params: string | string[], uri: string) => paramToString(params) === uri

const peerCount = computed(() =>
    clamp(microcosm.identities.filter((identity) => identity.joined).length - 1, 0)
)

const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
    `${count} ${count === 1 ? singular : plural}`

const handleUsername = (event: KeyboardEvent) => {
    session.user.key('username').set((event.target as HTMLInputElement).value)
}

const menuOpen = ref(false)

const appMenu = ref('')
const microcosmMenu = ref('')

const onMicrocosmSelect = (e: Event) => {
    console.log('select', menuOpen.value)
    e.stopPropagation()
    if (menuOpen.value) e.preventDefault()
}

</script>

<template>
    <nav>
        <MenubarRoot v-model="microcosmMenu" class="menubar-root" v-if="!!microcosm">

            <!-- <MenubarDivider /> -->
            <MenubarMenu value="file">
                <MenubarTrigger class="menubar-trigger title">
                    {{ microcosm.MicrocosmID }}
                    <div role="presentation" :class="{
            indicator: true,
            connected: microcosm.status.connected
        }" />
                </MenubarTrigger>
                <MenubarPortal>
                    <MenubarContent class="menubar-content" align="start" :side-offset="5" :align-offset="-3">
                        <MenubarLabel class="menubar-label">
                            {{ app.device.online ? 'online' : 'offline' }} Connected with {{ pluralize(peerCount,
            'other') }}
                        </MenubarLabel>
                        <MenubarSeparator class="menubar-separator" />
                        <MenubarItem class="menubar-item">
                            New Tab
                            <div class="RightSlot">
                                ⌘ T
                            </div>
                        </MenubarItem>
                        <MenubarItem class="menubar-item">
                            New Window
                            <div class="RightSlot">
                                ⌘ N
                            </div>
                        </MenubarItem>
                        <MenubarItem class="menubar-item" disabled>
                            New Incognito Window
                        </MenubarItem>
                        <MenubarSub>
                            <MenubarSubTrigger class="menubar-item">
                                Share
                                <div class="RightSlot">
                                    <!-- <Icon icon="radix-icons:chevron-right" /> -->
                                </div>
                            </MenubarSubTrigger>
                            <MenubarPortal>
                                <MenubarSubContent class="menubar-content" :align-offset="-5">
                                    <MenubarItem class="menubar-item">
                                        Email Link
                                    </MenubarItem>
                                    <MenubarItem class="menubar-item">
                                        Messages
                                    </MenubarItem>
                                    <MenubarItem class="menubar-item">
                                        Notes
                                    </MenubarItem>
                                </MenubarSubContent>
                            </MenubarPortal>
                        </MenubarSub>
                        <MenubarSeparator class="MenubarSeparator" />
                        <MenubarItem class="menubar-item">
                            Print…
                            <div class="RightSlot">
                                ⌘ P
                            </div>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarPortal>
            </MenubarMenu>
            <!-- <MenubarDivider /> -->

            <MenubarMenu v-if="!!microcosm">
                <MenubarTrigger class="menubar-trigger">
                    <span class="small">{{ view.type }}</span>
                </MenubarTrigger>
                <MenubarPortal>
                    <MenubarContent class="menubar-content fit" align="start" :side-offset="8" :align-offset="0">
                        <MenubarRadioGroup v-model="view.type">
                            <MenubarRadioItem v-for="view in views.types" :key="`${microcosm.MicrocosmID}${view}`"
                                class="menubar-checkbox-item inset" :value="view">
                                <MenubarItemIndicator class="menubar-item-indicator" />
                                {{ view }}
                            </MenubarRadioItem>
                        </MenubarRadioGroup>
                    </MenubarContent>
                </MenubarPortal>
            </MenubarMenu>
            <!-- <MenubarMenu>
                <MenubarTrigger class="menubar-trigger">
                    <div role="presentation" :class="{
            indicator: true,
            connected: microcosm.status.connected
        }" />

                </MenubarTrigger>
                <MenubarPortal>
                    <MenubarContent class="menubar-content fit" align="start" :side-offset="5" :align-offset="-3">

                        <div>
                            <label for="username">Username</label>
                            <Input id="username" :value="app.identity.username" @input="handleUsername"
                                placeholder="Anonymous" />
                        </div>

                        <MenubarLabel class="menubar-label">
                            Connected with {{ pluralize(peerCount, 'other') }}
                        </MenubarLabel>
                    </MenubarContent>
                </MenubarPortal>
            </MenubarMenu> -->
        </MenubarRoot>
    </nav>
</template>

<style scoped>
/* .slashed::after {
    content: '/';
    position: absolute;
    right: calc(-1 * var(--size-4));
} */
.slashed {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
}

nav {
    background: var(--ui-100);
    position: absolute;
    z-index: 200;
    inset: 0;
    margin-inline: auto;
    top: var(--size-8);
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    box-shadow: var(--ui-shadow-05);
    border-radius: calc(var(--ui-radius) * 2);
    padding: var(--size-4);
    gap: var(--size-2);
}

@media (prefers-color-scheme: dark) {
    nav {
        background: var(--ui-90);

    }
}

.menubar-root {
    display: flex;
    align-items: center;
    gap: var(--size-2);
}

:deep(.menubar-label) {
    display: flex;
    align-items: center;
}

:deep(.title) {
    font-size: 1.1em;
    font-weight: 500;
}

:deep(.menubar-trigger) {
    padding: 0 var(--size-8);
    outline: none;
    user-select: none;
    height: var(--size-32);
    border-radius: 4px;
    color: var(--grass-11);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
}

:deep(.small) {
    display: block;
    /* font-size: 0.8em; */
    /* letter-spacing: 0.05em; */
    /* font-weight: 600; */
    /* color: var(--ui-60); */
    /* text-transform: uppercase; */
}

:deep(.menubar-trigger:hover),
:deep(.menubar-trigger[data-highlighted]),
:deep(.menubar-trigger[data-state='open']) {
    background-color: var(--ui-80);
}

:deep(.menubar-content:not(.fit)) {
    min-width: 200px;
}

:deep(.menubar-content) {
    background-color: var(--ui-90);
    border-radius: var(--ui-radius);
    padding: var(--size-2);
    gap: var(--size-2);
    box-shadow: var(--ui-shadow-10);
    max-height: calc(100vh - 64px);
    overflow-y: scroll;
}

:deep(.menubar-label) {
    height: var(--size-32);
    padding: 0 var(--size-8);
    user-select: none;
    font-size: 0.8em;
}

:deep(.menubar-item),
:deep(.menubar-sub-trigger),
:deep(.menubar-checkbox-item),
:deep(.menubar-radio-item) {
    cursor: pointer;
    all: unset;
    cursor: pointer;
    height: var(--size-32);
    border-radius: 4px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 var(--size-8);
    user-select: none;
}

:deep(.menubar-item.inset),
:deep(.menubar-sub-trigger.inset),
:deep(.menubar-checkbox-item.inset),
:deep(.menubar-radio-item.inset) {
    padding-left: var(--size-24);
}

:deep(.menubar-item[data-highlighted]),
:deep(.menubar-sub-trigger[data-highlighted]),
:deep(.menubar-checkbox-item[data-highlighted]),
:deep(.menubar-radio-item[data-highlighted]) {
    background: var(--ui-80);
    /* background-image: linear-gradient(135deg, var(--grass-9) 0%, var(--grass-10) 100%); */
}

:deep(.menubar-item-indicator[data-state='checked']) {
    background: red;
}

:deep(.menubar-item-indicator) {
    position: absolute;
    left: var(--size-8);
    width: var(--size-8);
    height: var(--size-8);
    border-radius: var(--size-4);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: currentColor;
}

:deep(.menubar-separator) {
    height: 1px;
    background-color: var(--ui-80);
    margin: 2px;
}

:deep(.RightSlot) {
    margin-left: auto;
    padding-left: var(--size-24);
}

div.indicator {
    width: var(--size-4);
    height: var(--size-4);
    border-radius: 50%;
    background: var(--ui-50);
    margin-left: 0;
    margin-bottom: var(--size-8);
}

div.indicator.connected {
    background: var(--ui-green);
}

aside.status {
    border-radius: var(--size-24);
    height: var(--size-24);
    min-width: var(--size-24);
    padding: 0 var(--size-8);
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 0.8em;
    font-weight: bold;
    margin: 0 var(--size-4);
    background: var(--ui-100);
}

aside.status>p {
    margin-left: 4px;
}
</style>