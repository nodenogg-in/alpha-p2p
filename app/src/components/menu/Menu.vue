<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { getMicrososmID } from '@nodenogg.in/microcosm'
import { session, useApp } from '@/state'
import MenuLink from './MenuLink.vue'
import { paramToString } from '@/state'
import Input from '../input/Input.vue'
import MenuTrigger from './MenuTrigger.vue'
import { useRefineRef } from '@/hooks/use-refine-ref'

const app = useApp()
const newMicrocosmName = useRefineRef('', getMicrososmID)
const router = useRouter()

const handleInput = (event: KeyboardEvent) => {
  newMicrocosmName.value = (event.target as HTMLInputElement).value
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


const route = useRoute()

const isRoute = (params: string | string[], uri: string) => paramToString(params) === uri
</script>

<template>
  <nav :class="{ open: app.state.menuOpen }">
    <ul>
      <li class="input">
        <Input :value="newMicrocosmName" @input="handleInput" @keyup="handleKeyUp" placeholder="Join microcosm" />
      </li>
      <li v-for="microcosm of app.microcosms" v-bind:key="`menu-link-${microcosm.MicrocosmID}${microcosm.view}`">
        <MenuLink :microcosm="microcosm" :active="isRoute(route.params.MicrocosmID, microcosm.MicrocosmID)" />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  width: var(--app-menu-width);
  top: 0;
  left: 0;
  height: 100vh;
  max-height: calc(100vh);
  z-index: 99;
  color: var(--ui-10);
  background: var(--ui-95);
  box-shadow: var(--ui-shadow-0);
  transform: translate(-103%);
}

@media (prefers-color-scheme: dark) {
  nav {
    background: var(--ui-90);
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
  padding: var(--size-8);
}

li {
  margin-bottom: var(--size-2);
}

/* li.input {
    padding: var(--size-4);
} */

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
