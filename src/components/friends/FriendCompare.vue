<template>
    <v-expansion-panels v-if="loaded" :elevation="ELEVATION" class="mb-2">
        <v-expansion-panel>
            <template #title>
                <span class="v-card-title pa-0">Comparatif avec {{ friendUsername }}</span>
            </template>
            <template #text>
                <div class="compare-header">
                    <span class="compare-header-name">Vous</span>
                    <span class="compare-header-name">{{ friendUsername }}</span>
                </div>

                <div v-for="row in rows" :key="row.label" class="compare-row">
                    <div class="compare-value" :class="{ 'compare-value--ahead': row.mine > row.theirs }">
                        {{ row.format(row.mine) }}
                    </div>
                    <div class="compare-label">
                        <v-icon :icon="row.icon" size="16" class="me-1" />
                        {{ row.label }}
                    </div>
                    <div class="compare-value compare-value--right" :class="{ 'compare-value--ahead': row.theirs > row.mine }">
                        {{ row.format(row.theirs) }}
                    </div>
                </div>
            </template>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts" setup>
import { useStatistic } from "@/composables/statistic";
import { ELEVATION } from "@/constants/style";
import { minsToStringHoursDays } from "@/utils/format";
import { computed, onBeforeMount, ref } from "vue";
import type { GlobalStat } from "@/models/stat";

const props = defineProps({
    friendId: { type: String, required: true },
    friendUsername: { type: String, required: true }
});

const { getStats } = useStatistic();

const mine = ref<GlobalStat>();
const theirs = ref<GlobalStat>();
const loaded = computed(() => !!mine.value && !!theirs.value);

const rows = computed(() => {
    if (!mine.value || !theirs.value) return [];

    return [
        { label: "Temps total", icon: "mdi-timer-sand-complete", mine: mine.value.totalTime, theirs: theirs.value.totalTime, format: minsToStringHoursDays },
        { label: "Séries", icon: "mdi-play", mine: mine.value.nbSeries, theirs: theirs.value.nbSeries, format: String },
        { label: "Saisons", icon: "mdi-play", mine: mine.value.nbSeasons, theirs: theirs.value.nbSeasons, format: String },
        { label: "Episodes", icon: "mdi-play", mine: mine.value.nbEpisodes, theirs: theirs.value.nbEpisodes, format: String },
        { label: "Jours d'affilés", icon: "mdi-fire", mine: mine.value.currentStreak, theirs: theirs.value.currentStreak, format: String },
    ];
});

onBeforeMount(async () => {
    [mine.value, theirs.value] = await Promise.all([getStats(), getStats(props.friendId)]);
});
</script>

<style scoped>
.compare-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.compare-header-name {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgb(var(--v-theme-on-surface-variant));
}

.compare-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    border-top: 1px solid rgb(var(--v-border-color));
}

.compare-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12.5px;
    color: rgb(var(--v-theme-on-surface-variant));
    white-space: nowrap;
}

.compare-value {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 15px;
}

.compare-value--right {
    text-align: right;
}

.compare-value--ahead {
    color: rgb(var(--v-theme-primary));
}
</style>
