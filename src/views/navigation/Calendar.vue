<template>
    <base-app-bar />

    <v-container class="upcoming-container">
        <div v-if="loading" class="upcoming-loading">
            <v-progress-circular color="primary" indeterminate />
        </div>

        <template v-else-if="groups.length">
            <div v-for="group in groups" :key="group.date" class="upcoming-group">
                <div class="day-badge" :class="{ 'day-badge--today': group.isToday }">
                    <span class="day-badge-dow">{{ group.dow }}</span>
                    <span class="day-badge-num">{{ group.day }}</span>
                </div>

                <div class="upcoming-column">
                    <div class="upcoming-label">{{ group.label }}</div>

                    <router-link v-for="serie in group.series" :key="serie.id" :to="`/series/${serie.id}`"
                        class="upcoming-card">
                        <base-image v-if="serie.poster" class="upcoming-poster" :src="serie.poster" cover />
                        <div v-else class="upcoming-poster upcoming-poster--empty">
                            <v-icon icon="mdi-movie-open-outline" size="16" />
                        </div>
                        <div class="upcoming-info">
                            <div class="upcoming-title">{{ serie.title }}</div>
                            <div v-if="serie.kinds?.length" class="upcoming-kinds">{{ serie.kinds.slice(0, 2).join(" · ") }}</div>
                        </div>
                        <v-icon icon="mdi-chevron-right" size="18" class="upcoming-chevron" />
                    </router-link>
                </div>
            </div>
        </template>

        <empty-state v-else icon="mdi-calendar-blank-outline" title="Rien à venir"
            description="Les prochains épisodes de vos séries suivies apparaîtront ici dès qu'une date de diffusion sera connue." />
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseImage from "@/components/BaseImage.vue";
import EmptyState from "@/components/EmptyState.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { SerieStatus } from "@/types/types";
import { computed, onBeforeMount, ref } from "vue";

const WEEKDAYS_SHORT = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const WEEKDAYS_LONG = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const { getSeriesByStatus } = useSerie();

const loading = ref(false);
const series = ref<Serie[]>([]);

const parseLocalDate = (dateStr: string): Date => {
    const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);
    return new Date(y, m - 1, d);
}

const isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const groups = computed(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const byDate = new Map<string, Serie[]>();
    const withDate = series.value
        .filter((serie) => !!serie.nextEpisode)
        .sort((a, b) => (a.nextEpisode as string).localeCompare(b.nextEpisode as string));

    for (const serie of withDate) {
        const key = (serie.nextEpisode as string).slice(0, 10);
        if (!byDate.has(key)) byDate.set(key, []);
        byDate.get(key)!.push(serie);
    }

    return Array.from(byDate.entries()).map(([key, list]) => {
        const date = parseLocalDate(key);
        const isToday = isSameDay(date, today);
        const isTomorrow = isSameDay(date, tomorrow);
        const label = isToday ? "Aujourd'hui" : isTomorrow ? "Demain" : `${WEEKDAYS_LONG[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;

        return {
            date: key,
            day: date.getDate(),
            dow: WEEKDAYS_SHORT[date.getDay()],
            isToday,
            label,
            series: list,
        };
    });
});

onBeforeMount(async () => {
    loading.value = true;
    try {
        series.value = await getSeriesByStatus(SerieStatus.Next);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.upcoming-container {
    max-width: 720px;
}

.upcoming-loading {
    display: flex;
    justify-content: center;
    padding: 64px 0;
}

.upcoming-group {
    display: flex;
    gap: 16px;
    margin-bottom: 28px;
}

.day-badge {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgb(var(--v-theme-surface-variant));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.1;
}

.day-badge--today {
    background: rgb(var(--v-theme-primary));
}

.day-badge--today .day-badge-dow,
.day-badge--today .day-badge-num {
    color: #fff;
}

.day-badge-dow {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: rgb(var(--v-theme-on-surface-variant));
}

.day-badge-num {
    font-family: "Space Grotesk", sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: rgb(var(--v-theme-on-surface));
}

.upcoming-column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.upcoming-label {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 14px;
    padding-top: 6px;
    margin-bottom: 2px;
}

.upcoming-card {
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

.upcoming-card:hover {
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 8px 18px rgba(76, 60, 150, 0.1);
}

.upcoming-poster {
    flex-shrink: 0;
    width: 40px;
}

.upcoming-poster--empty {
    aspect-ratio: 0.679;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgb(var(--v-theme-surface-variant));
    color: rgb(var(--v-theme-on-surface-variant));
}

.upcoming-info {
    flex: 1;
    min-width: 0;
}

.upcoming-title {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.upcoming-kinds {
    font-size: 12px;
    color: rgb(var(--v-theme-on-surface-variant));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.upcoming-chevron {
    flex-shrink: 0;
    color: rgb(var(--v-theme-on-surface-variant));
}
</style>
