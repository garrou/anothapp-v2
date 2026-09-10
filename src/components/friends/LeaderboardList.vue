<template>
    <div>
        <div class="leaderboard-header">
            <h2 class="leaderboard-title">Classement du mois</h2>
            <p class="leaderboard-subtitle">Temps de visionnage entre amis, ce mois-ci</p>
        </div>

        <div v-if="loading" class="leaderboard-loading">
            <v-progress-circular color="primary" indeterminate size="32" />
        </div>

        <empty-state v-else-if="entries.length <= 1" icon="mdi-account-heart-outline" title="Aucun ami pour l'instant"
            description="Ajoutez des amis pour comparer votre temps de visionnage." />

        <v-list v-else class="leaderboard-list" lines="two">
            <v-list-item v-for="(entry, index) in entries" :key="entry.id" class="leaderboard-item"
                :class="{ 'leaderboard-item--me': entry.isMe }"
                :link="!entry.isMe" @click="!entry.isMe && showFriend(entry)">
                <template #prepend>
                    <div class="leaderboard-rank">{{ index + 1 }}</div>
                    <v-avatar v-if="entry.picture" :image="entry.picture" size="36" class="ms-2" />
                    <v-avatar v-else color="surface-variant" size="36" class="ms-2">
                        <v-icon icon="mdi-account" />
                    </v-avatar>
                </template>

                <v-list-item-title class="leaderboard-username">
                    {{ entry.username }}<span v-if="entry.isMe" class="leaderboard-you"> (vous)</span>
                </v-list-item-title>

                <template #append>
                    <div class="leaderboard-value">{{ minsToStringHoursDays(entry.value) }}</div>
                </template>
            </v-list-item>
        </v-list>
    </div>
</template>

<script lang="ts" setup>
import EmptyState from "@/components/EmptyState.vue";
import { useStatistic } from "@/composables/statistic";
import type { LeaderboardEntry } from "@/models/stat";
import { minsToStringHoursDays } from "@/utils/format";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { getLeaderboard } = useStatistic();

const entries = ref<LeaderboardEntry[]>([]);
const loading = ref(false);

const showFriend = (entry: LeaderboardEntry) => {
    router.push(`/friends/${entry.id}`);
}

onBeforeMount(async () => {
    loading.value = true;
    try {
        entries.value = await getLeaderboard();
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.leaderboard-header {
    margin-bottom: 12px;
}

.leaderboard-title {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 16px;
}

.leaderboard-subtitle {
    margin-top: 2px;
    font-size: 12.5px;
    color: rgb(var(--v-theme-on-surface-variant));
}

.leaderboard-loading {
    display: flex;
    justify-content: center;
    padding: 32px 16px;
}

.leaderboard-list {
    background: transparent;
}

.leaderboard-item {
    border-radius: 14px;
    margin-bottom: 8px;
    border: 1px solid rgb(var(--v-border-color));
}

.leaderboard-item--me {
    border-color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.06);
}

.leaderboard-rank {
    width: 22px;
    text-align: center;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    color: rgb(var(--v-theme-on-surface-variant));
}

.leaderboard-username {
    font-weight: 600;
}

.leaderboard-you {
    font-weight: 400;
    color: rgb(var(--v-theme-on-surface-variant));
}

.leaderboard-value {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 14px;
}
</style>
