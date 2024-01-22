<script setup lang="ts">
import { useCurrentMicrocosm } from '@/stores/use-microcosm';
import NodeList from './NodeList.vue'
import Provider from './containers/Provider.vue';
import Canvas from './containers/Canvas.vue';
import { defaultNodeSize } from '@/stores/use-microcosm'
import Toolbar from './components/Toolbar.vue';

const microcosm = useCurrentMicrocosm()

const onFilesDropped = (filesHTML: string[]) => {
    filesHTML.forEach((content) => {
        microcosm.create({
            type: 'html',
            content,
            x: 0,
            y: 0,
            ...defaultNodeSize
        })
    })
}

</script>
  
<template>
    <Provider :microcosm_uri="microcosm.microcosm_uri">
        <Canvas pannable trackpadPan @files-dropped="onFilesDropped">
            <NodeList v-for="(user_id) in microcosm.nodeLists" :user_id="user_id" v-bind:key="`spatial${user_id}`" />
        </Canvas>
        <Toolbar />
    </Provider>
</template>
