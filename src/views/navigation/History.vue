<template>
    <base-app-bar />

    <v-container class="history-container">
        <v-select v-model="month" class="mb-4" style="max-width: 280px" :density="DENSITY" hide-details
            :items="MONTHS" item-title="text" item-value="value" @update:model-value="getHistory" />

        <div v-if="loading" class="history-loading">
            <v-progress-circular color="primary" indeterminate />
        </div>

        <template v-else-if="groups.length">
            <div v-for="group in groups" :key="group.date" class="history-group">
                <day-badge :active="group.isToday" :day="group.day" :dow="group.dow" />

                <div class="history-column">
                    <div class="history-label">{{ group.label }}</div>

                    <router-link v-for="item in group.items" :key="`${item.showId}-${item.season.number}`"
                        :to="`/series/${item.showId}`" class="history-card">
                        <base-image v-if="item.season.image" class="history-poster" :src="item.season.image" cover />
                        <div v-else class="history-poster history-poster--empty">
                            <v-icon icon="mdi-movie-open-outline" size="16" />
                        </div>

                        <div class="history-info">
                            <div class="history-title">{{ item.showTitle }}</div>
                            <div class="history-subtitle">{{ seasonSubtitle(item.season) }}</div>
                        </div>

                        <platform-card class="history-platform" :platform="getSpecificPlatform(item.platformId)" />
                        <v-icon icon="mdi-chevron-right" size="18" class="history-chevron" />
                    </router-link>
                </div>
            </div>
        </template>

        <empty-state v-else icon="mdi-history" title="Aucun historique"
            description="Les saisons que vous marquez comme vues apparaissent ici." />
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseImage from "@/components/BaseImage.vue";
import DayBadge from "@/components/DayBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import { useSearch } from "@/composables/search";
import { useSeason } from "@/composables/season";
import { DENSITY } from "@/constants/style";
import type { Season, SeasonTimeline } from "@/models/season";
import type { Platform } from "@/models/serie";
import { buildPlural } from "@/utils/format";
import { MONTHS_FR, WEEKDAYS_LONG, WEEKDAYS_SHORT, isSameDay, parseLocalDate } from "@/utils/date";
import { computed, onBeforeMount, ref } from "vue";
import PlatformCard from "@/components/series/PlatformCard.vue";

const MONTHS = [
    { text: "Ce mois", value: 0 },
    { text: "Depuis un mois", value: 1 },
    { text: "Depuis 2 mois", value: 2 },
    { text: "Depuis 3 mois", value: 3 },
    { text: "Depuis 6 mois", value: 6 },
    { text: "Depuis 1 an", value: 12 }
];

const { getPlatforms } = useSearch();
const { getSeasonsTimeline } = useSeason();

const loading = ref(false);
const month = ref(0);
const timeline = ref<SeasonTimeline[]>([]);
const platforms = ref<Platform[]>([]);

const seasonSubtitle = (season: Season): string =>
    `Saison ${season.number} · ${buildPlural("épisode", season.episodes)}`;

const getSpecificPlatform = (id?: number): Platform | undefined => platforms.value.find((p) => p.id === id);

const groups = computed(() => {
    const today = new Date();

    const byDate = new Map<string, SeasonTimeline[]>();
    const sorted = [...timeline.value].sort((a, b) => b.addedAt.localeCompare(a.addedAt));

    for (const item of sorted) {
        const key = item.addedAt.slice(0, 10);
        if (!byDate.has(key)) byDate.set(key, []);
        byDate.get(key)!.push(item);
    }

    return Array.from(byDate.entries()).map(([key, items]) => {
        const date = parseLocalDate(key);
        const isToday = isSameDay(date, today);
        const label = isToday ? "Aujourd'hui" : `${WEEKDAYS_LONG[date.getDay()]} ${date.getDate()} ${MONTHS_FR[date.getMonth()]}`;

        return {
            date: key,
            day: date.getDate(),
            dow: WEEKDAYS_SHORT[date.getDay()],
            isToday,
            label,
            items,
        };
    });
});

const getHistory = async () => {
    loading.value = true;
    try {
        timeline.value = await getSeasonsTimeline(month.value);
    } finally {
        loading.value = false;
    }
}

const getAllPlatforms = async () => {
    platforms.value = await getPlatforms();
}

onBeforeMount(async () => {
    await Promise.all([
        getAllPlatforms(),
        getHistory()
    ]);
})
</script>

<style scoped>
.history-container {
    max-width: 720px;
}

.history-loading {
    display: flex;
    justify-content: center;
    padding: 64px 0;
}

.history-group {
    display: flex;
    gap: 16px;
    margin-bottom: 28px;
}

.history-column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.history-label {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 14px;
    padding-top: 6px;
    margin-bottom: 2px;
}

.history-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border: 1px solid rgb(var(--v-border-color));
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.history-card:hover {
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 8px 18px rgba(76, 60, 150, 0.1);
}

.history-poster {
    flex-shrink: 0;
    width: 40px;
}

.history-poster--empty {
    aspect-ratio: 0.679;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgb(var(--v-theme-surface-variant));
    color: rgb(var(--v-theme-on-surface-variant));
}

.history-info {
    flex: 1;
    min-width: 0;
}

.history-title {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.history-subtitle {
    font-size: 12px;
    color: rgb(var(--v-theme-on-surface-variant));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.history-platform {
    flex-shrink: 0;
}

.history-chevron {
    flex-shrink: 0;
    color: rgb(var(--v-theme-on-surface-variant));
}
</style>
