<script setup lang="ts">
import { useCurrentMicrocosm } from '../../stores/use-demo-state'

const { data } = useCurrentMicrocosm()

</script>

<template>
    <div>
        <h1>Microcosm</h1>
        {{ JSON.stringify(data.uri) }}
    </div>
</template>

<style scoped>
h1 {
    font-size: 36px;
    font-weight: bold;
}
</style>