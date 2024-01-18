<script setup lang="ts">
import { useCurrentMicrocosm } from '@/stores/use-microcosm';
import { pluralize } from '@/utils';
import Switch from '@/components/Switch.vue';
import { useApp } from '@/stores/use-app';

const microcosm = useCurrentMicrocosm()
const app = useApp()

const addRandomNode = () => {
    microcosm.create({
        html: Math.random().toString(),
        x: 0,
        y: 0,
    })
}

</script>

<template>
    <nav>

        <h1>
            {{ microcosm.microcosm_uri }}
        </h1>
        <div>
            <input v-model="app.identity.username" placeholder="Username">
        </div>

        <div>
            <button @click="addRandomNode">New</button>
            <button @click="microcosm.undo">Undo</button>
            <button @click="microcosm.redo">redo</button>
            <aside>
                <Switch v-model="microcosm.shared" label="Shared" id="shared" />
                <!-- <div aria-hidden :class="{
                    indicator: true,
                    connected: microcosm.connected,
                    ready: microcosm.ready
                }" /> -->
                <p>{{ pluralize(microcosm.identities, 'peer') }}</p>
            </aside>
        </div>

    </nav>
</template>

<style scoped>
nav {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 50px;
    background: white;
    padding: 10px;
    z-index: 10;
    display: flex;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

div.indicator {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: white;
    margin-right: 5px;
}

nav>h1 {
    font-size: 16px;
    margin-right: 10px;
}

div {
    display: flex;
    align-items: center;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    list-style: none;
}

.dot {
    border-radius: 3px;
    width: 6px;
    height: 6px;
    background: rgb(113, 113, 113);
    display: inline-block;
    margin-right: 5px;
}

.indicator.connected {
    background: rgb(133, 229, 133);
}

aside {
    background: rgb(240,240,240);
    border-radius: 24px;
    height: 24px;
    padding: 0 8px;
    align-items: center;
    display: flex;
    font-size: 10px;
    font-weight: bold;
    margin: 0 4px;
}

details {
    padding: 0;
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
    font-weight: bold;
    cursor: pointer;
}
</style>