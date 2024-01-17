<script setup lang="ts">
import { useCurrentMicrocosm } from '@/stores/use-microcosm';
import { pluralize } from '@/utils';
import Switch from './Switch.vue';

const { data, actions } = useCurrentMicrocosm()

</script>

<template>
    <nav>
        <h1>{{ data.microcosm_uri }}</h1>
        <div>
            <Switch v-model="data.shared" label="Shared" id="shared" />
            <button @click="actions.undo">Undo</button>
            <button @click="actions.redo">redo</button>
            <span>
                Connected:{{ data.connected }}
            </span>
            <span>
                Ready:{{ data.ready }}
            </span>
            <span>
                <p>{{ pluralize(data.identities, 'peer') }}</p>
            </span>
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

.dot.connected {
    background: rgb(133, 229, 133);
}

span {
    background: rgb(60, 60, 60);
    color: white;
    border-radius: 12px;
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