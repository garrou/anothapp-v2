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
import { FIRE_ICON, PLAY_ICON, TIME_ICON } from "@/constants/icons";
import { minsToStringHoursDays } from "@/utils/format";
import { computed, onBeforeMount, ref, type PropType } from "vue";
import type { GlobalStat } from "@/models/stat";

const props = defineProps({
    friendUsername: { type: String, required: true },
    theirs: { type: Object as PropType<Promise<GlobalStat>>, required: true }
});

const { getStats } = useStatistic();

const mine = ref<GlobalStat>();
const theirs = ref<GlobalStat>();
const loaded = computed(() => !!mine.value && !!theirs.value);

const rows = computed(() => {
    if (!mine.value || !theirs.value) return [];
    const theirStats = theirs.value;

    return [
        { label: "Temps total", icon: TIME_ICON, mine: mine.value.totalTime, theirs: theirStats.totalTime, format: minsToStringHoursDays },
        { label: "Séries", icon: PLAY_ICON, mine: mine.value.nbSeries, theirs: theirStats.nbSeries, format: String },
        { label: "Saisons", icon: PLAY_ICON, mine: mine.value.nbSeasons, theirs: theirStats.nbSeasons, format: String },
        { label: "Episodes", icon: PLAY_ICON, mine: mine.value.nbEpisodes, theirs: theirStats.nbEpisodes, format: String },
        { label: "Jours d'affilés", icon: FIRE_ICON, mine: mine.value.currentStreak, theirs: theirStats.currentStreak, format: String },
    ];
});

onBeforeMount(async () => {
    [mine.value, theirs.value] = await Promise.all([getStats(), props.theirs]);
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
