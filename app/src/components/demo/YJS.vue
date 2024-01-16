<script setup lang="ts">
import { useYJSStore } from '../../stores/demo/use-yjs-store'
import YJSListVue from './YJSList.vue';

const yjs = useYJSStore()

const handleClick = () => {
    yjs.createNode({
        html: '<p></p>',
        x: Math.random(),
        y: Math.random()
    })
}
// console.log( yjs.manager.localNodes.toJSON())
// console.log(yjs.getMap('cf4c6f5c-aecb-4d6a-ba5a-a2f5cc589bbb-nodes').toJSON())
</script>

<template>
    <button :on-click="handleClick">Add node</button>
    <div>
        <h1>Y.Doc Data for {{ yjs.user_id }}</h1>
        <div v-for="[user_id, user] in yjs.users" :key="user_id">
            {{ JSON.stringify(user) }}
        </div>
        <!-- <div v-for="[peerId, peerMap] in yjs.reactiveLocalNodes" :key="peerId">
            {{ peerId }} -->
        <!-- <YJSListVue :map_key="peerId" />
        </div> -->
    </div>
</template>