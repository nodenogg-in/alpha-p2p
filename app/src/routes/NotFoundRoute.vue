<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute()
</script>
<template>
    <main>
        <h1>Not found</h1>
        <div>
            <p v-if="route.query.message">{{ route.query.message }}</p>
        </div>
    </main>
</template>

<style scoped>
main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: white;
}
</style>