<script lang="ts" setup>
import { useCurrentSpatialView } from '../stores/use-spatial-view'
import { useCursor } from '../stores/use-cursor'

const view = useCurrentSpatialView();
const cursor = useCursor()

</script>

<template>
    <div class="debug">
        <h4>View</h4>
        <pre>{{ JSON.stringify(view, null, 2) }}</pre>
        <!-- <h4>Cursor</h4>
        <pre>{{ JSON.stringify(cursor, null, 2) }}</pre> -->
    </div>
</template>
            
<style scoped>
.debug {
    position: fixed;
    z-index: 100;
    background: rgba(40,40,40, 0.9);
    font-size: 10px;
    max-width: 400px;
    color: white;
    top: 10px;
    right: 10px;
    transform-origin: 0% 0%;
    padding: 10px;
}

h4 {
    font-size: 14px;
}
</style>../stores/use-spatial-view