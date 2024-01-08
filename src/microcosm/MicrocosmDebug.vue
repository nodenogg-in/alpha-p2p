<script setup lang="ts">
import { type PropType } from 'vue';
import { type MicrocosmStore, useAppState } from '../stores/microcosm'
import { pluralize } from '@/utils';

const props = defineProps({
    microcosm: {
        type: Object as PropType<MicrocosmStore>,
        required: true
    }
})

const app = useAppState()

</script>

<template>
    <aside>
        <div>
            <p>My identity</p>
            {{ app.identity }}
        </div>
        <div>
            <p>Connected identities</p>
            <ul>
                <li v-for="[uid, identity] in props.microcosm.identities" v-bind:key="uid">
                    <span>{{ identity.username || 'Anonymous' }}</span>
                </li>
            </ul>
        </div>
        <div>
            <button @click="app.refresh">Refresh</button>
            {{ pluralize(props.microcosm.identities, 'peer') }}
        </div>
    </aside>
</template>

<style scoped>
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    list-style: none;
}

aside {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgb(60, 60, 60);
    color: white;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
}
</style>
