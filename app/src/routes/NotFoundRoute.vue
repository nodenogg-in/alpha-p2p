<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute()
</script>
<template>
    <main>
        <h1>Sorry, couldn't find what you're looking for.</h1>
        <p v-if="route.query.message">{{ route.query.message }}</p>
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
    color: var(--ui-0);
}

h1 {
    text-align: center;
    max-width: 300px;
}

p {
    padding: 10px;
    max-width: 300px;
}
</style>