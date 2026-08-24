<template>
    <base-app-bar />

    <v-container class="history-container">
        <v-menu v-model="menuOpen" location="bottom start" :close-on-content-click="true">
            <template #activator="{ props: menuProps }">
                <button type="button" class="month-trigger" v-bind="menuProps">
                    <v-icon icon="mdi-calendar-range" size="17" />
                    <span>{{ selectedMonthLabel }}</span>
                    <v-icon icon="mdi-chevron-down" size="18" class="month-trigger-chevron"
                        :class="{ 'month-trigger-chevron--open': menuOpen }" />
                </button>
            </template>

            <div class="month-menu">
                <button v-for="opt in MONTHS" :key="opt.value" type="button" class="month-option"
                    :class="{ 'month-option--active': opt.value === month }" @click="selectMonth(opt.value)">
                    {{ opt.text }}
                    <v-icon v-if="opt.value === month" icon="mdi-check" size="16" />
                </button>
            </div>
        </v-menu>

        <div v-if="loading" class="history-loading">
            <v-progress-circular color="primary" indeterminate />
        </div>

        <template v-else-if="groups.length">
            <div v-for="group in groups" :key="group.date" class="history-group">
                <day-badge :active="group.isToday" :day="group.day" :dow="group.dow" />

                <div class="history-column">
                    <div class="history-label">{{ group.label }}</div>

                    <router-link v-for="item in group.items" :key="item.key" :to="`/series/${item.showId}`"
                        class="history-card">
                        <base-image v-if="item.poster" class="history-poster" :src="item.poster" cover />
                        <div v-else class="history-poster history-poster--empty">
                            <v-icon icon="mdi-movie-open-outline" size="16" />
                        </div>

                        <div class="history-info">
                            <div class="history-title">{{ item.title }}</div>
                            <div class="history-subtitle">{{ item.subtitle }}</div>
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
import { useEpisode } from "@/composables/episode";
import { useUser } from "@/composables/user";
import type { SeasonTimeline } from "@/models/season";
import type { EpisodeTimeline } from "@/models/episodeTimeline";
import type { Platform } from "@/models/serie";
import { buildPlural } from "@/utils/format";
import { MONTHS_FR, WEEKDAYS_LONG, WEEKDAYS_SHORT, isSameDay, parseLocalDate } from "@/utils/date";
import { computed, onBeforeMount, ref } from "vue";
import PlatformCard from "@/components/series/PlatformCard.vue";

interface HistoryCard {
    key: string;
    date: string;
    showId: number;
    title: string;
    subtitle: string;
    poster?: string;
    platformId?: number;
}

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
const { getEpisodesTimeline } = useEpisode();
const { getProfile } = useUser();

const loading = ref(false);
const month = ref(0);
const menuOpen = ref(false);
const timeline = ref<SeasonTimeline[]>([]);
const episodeTimeline = ref<EpisodeTimeline[]>([]);
const platforms = ref<Platform[]>([]);
const episodeTrackingEnabled = ref(false);

const selectedMonthLabel = computed(() => MONTHS.find((m) => m.value === month.value)?.text ?? MONTHS[0].text);

const selectMonth = (value: number) => {
    month.value = value;
    getHistory();
}

const getSpecificPlatform = (id?: number): Platform | undefined => platforms.value.find((p) => p.id === id);

const seasonCards = computed<HistoryCard[]>(() => timeline.value.map((item) => ({
    key: `season-${item.showId}-${item.season.number}-${item.addedAt}`,
    date: item.addedAt,
    showId: item.showId,
    title: item.showTitle,
    subtitle: `Saison ${item.season.number} · ${buildPlural("épisode", item.season.episodes)}`,
    poster: item.season.image,
    platformId: item.platformId
})));

const episodeCards = computed<HistoryCard[]>(() => episodeTimeline.value.map((item) => ({
    key: `episode-${item.episode.id}-${item.watchedAt}`,
    date: item.watchedAt,
    showId: item.showId,
    title: item.showTitle,
    subtitle: `${item.episode.code} · ${item.episode.title}`,
    poster: item.showPoster,
    platformId: item.platformId
})));

const groups = computed(() => {
    const today = new Date();

    const byDate = new Map<string, HistoryCard[]>();
    const sorted = [...seasonCards.value, ...episodeCards.value].sort((a, b) => b.date.localeCompare(a.date));

    for (const item of sorted) {
        const key = item.date.slice(0, 10);
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
        const requests: Promise<void>[] = [
            getSeasonsTimeline(month.value).then((data) => { timeline.value = data; })
        ];
        if (episodeTrackingEnabled.value) {
            requests.push(getEpisodesTimeline(month.value).then((data) => { episodeTimeline.value = data; }));
        }
        await Promise.all(requests);
    } finally {
        loading.value = false;
    }
}

const getAllPlatforms = async () => {
    platforms.value = await getPlatforms();
}

onBeforeMount(async () => {
    const user = await getProfile();
    episodeTrackingEnabled.value = user.episodeTrackingEnabled ?? false;
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

.month-trigger {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 220px;
    padding: 10px 16px;
    border: 1px solid rgb(var(--v-border-color));
    border-radius: 999px;
    background: rgb(var(--v-theme-surface));
    color: rgb(var(--v-theme-on-surface));
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    margin-bottom: 20px;
}

.month-trigger:hover {
    border-color: rgb(var(--v-theme-primary));
}

.month-trigger span {
    flex: 1;
    text-align: left;
}

.month-trigger-chevron {
    color: rgb(var(--v-theme-on-surface-variant));
    transition: transform 0.15s ease;
}

.month-trigger-chevron--open {
    transform: rotate(180deg);
}

.month-menu {
    display: flex;
    flex-direction: column;
    min-width: 240px;
    padding: 6px;
    border-radius: 14px;
    background: rgb(var(--v-theme-surface));
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
}

.month-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 12px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: rgb(var(--v-theme-on-surface));
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
}

.month-option:hover {
    background: rgb(var(--v-theme-surface-variant));
}

.month-option--active {
    color: rgb(var(--v-theme-primary));
    font-weight: 700;
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
