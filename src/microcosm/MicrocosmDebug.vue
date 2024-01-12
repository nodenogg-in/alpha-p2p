<script setup lang="ts">
import { useAppState } from '../stores/use-app-state'
import { pluralize } from '@/utils';

// const props = defineProps({
//     microcosm: {
//         type: Object as PropType<MicrocosmStore>,
//         required: true
//     }
// })

const app = useAppState()

</script>

<template>
    <aside>
        <div>
            <details :open="app.allUsers.size > 0">
                <summary>
                    <p>{{ pluralize(app.allUsers, 'peer') }}</p>
                </summary>
                <ul>
                    <li v-for="[user_id, identity] in app.allUsers" v-bind:key="user_id">
                        <span>{{ identity.username || 'Anonymous' }}</span>
                    </li>
                </ul>
            </details>
        </div>
        <!-- <div>
            <button @click="app.refresh">Refresh</button>
        </div> -->
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
    bottom: 10px;
    right: 10px;
    background: rgb(60, 60, 60);
    color: white;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
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
../stores/app