<script setup lang="ts">
import { useCurrentMicrocosm } from '@/stores/use-microcosm';
import NodeList from './NodeList.vue'

const microcosm = useCurrentMicrocosm()

</script>
  
<template>
    <div class="inner">
        <NodeList v-for="(user_id) in microcosm.nodeLists" :user_id="user_id" v-bind:key="`spatial${user_id}`" />
    </div>
</template>
  
<style scoped>
div.inner {
    background: rgba(245, 245, 245, 1.0);
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow-x: scroll;
    overflow-y: scroll;
}
</style>
