<script setup lang="ts">
import { useCurrentMicrocosm } from '@/stores/use-microcosm';
import { pluralize } from '@/utils';

const { data } = useCurrentMicrocosm()

</script>

<template>
    <aside>
        <div>
            <details :open="data.users.size > 0">
                <summary>
                    <p>{{ pluralize(data.users, 'peer') }}</p>
                </summary>
                <ul>
                    <li v-for="[user_id, identity] in data?.users" v-bind:key="user_id">
                        <span>
                            {{ identity.username || 'Anonymous' }}
                        </span>
                    </li>
                </ul>
            </details>
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

aside {
    background: rgb(60, 60, 60);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: bold;
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
</style>@/stores/use-microcosm@/stores/use-microcosm-store