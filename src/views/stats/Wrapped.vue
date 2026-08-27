<template>
    <base-app-bar />

    <v-container class="wrapped-container">
        <div class="wrapped-header">
            <h1 class="wrapped-title">Votre année {{ selectedYear }}</h1>
            <v-select v-model="selectedYear" class="wrapped-year-select" :items="years" density="compact"
                hide-details variant="outlined" />
        </div>

        <div v-if="loading" class="wrapped-loading">
            <v-progress-circular color="primary" indeterminate size="32" />
        </div>

        <template v-else-if="wrapped">
            <div v-if="!wrapped.totalTime" class="wrapped-empty">
                <v-icon icon="mdi-movie-open-off-outline" size="40" class="mb-2" />
                <p>Rien à afficher pour {{ selectedYear }}.</p>
            </div>

            <div v-else class="wrapped-grid">
                <div class="wrapped-card wrapped-card--hero" :style="cardStyle(0)">
                    <div class="wrapped-card-value">{{ minsToStringHoursDays(wrapped.totalTime) }}</div>
                    <div class="wrapped-card-label">de visionnage</div>
                </div>

                <div class="wrapped-card" :style="cardStyle(1)">
                    <div class="wrapped-card-value">{{ wrapped.totalEpisodes }}</div>
                    <div class="wrapped-card-label">épisodes vus</div>
                </div>

                <div class="wrapped-card" :style="cardStyle(2)">
                    <div class="wrapped-card-value">{{ wrapped.nbNewShows }}</div>
                    <div class="wrapped-card-label">
                        {{ wrapped.nbNewShows > 1 ? "nouvelles séries découvertes" : "nouvelle série découverte" }}
                    </div>
                </div>

                <div v-if="wrapped.topShow" class="wrapped-card" :style="cardStyle(3)">
                    <div class="wrapped-card-value wrapped-card-value--text">{{ wrapped.topShow.label }}</div>
                    <div class="wrapped-card-label">votre série de l'année</div>
                </div>

                <div v-if="wrapped.topKind" class="wrapped-card" :style="cardStyle(4)">
                    <div class="wrapped-card-value wrapped-card-value--text">{{ wrapped.topKind.label }}</div>
                    <div class="wrapped-card-label">genre préféré</div>
                </div>

                <div v-if="wrapped.topPlatform" class="wrapped-card" :style="cardStyle(5)">
                    <div class="wrapped-card-value wrapped-card-value--text">{{ wrapped.topPlatform.label }}</div>
                    <div class="wrapped-card-label">plateforme préférée</div>
                </div>

                <div v-if="wrapped.bestMonth" class="wrapped-card" :style="cardStyle(6)">
                    <div class="wrapped-card-value wrapped-card-value--text">{{ wrapped.bestMonth.label.trim() }}</div>
                    <div class="wrapped-card-label">mois le plus actif</div>
                </div>
            </div>
        </template>
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import { useStatistic } from "@/composables/statistic";
import type { WrappedStat } from "@/models/stat";
import { CATEGORICAL_COLORS } from "@/constants/style";
import { minsToStringHoursDays } from "@/utils/format";
import { computed, ref, watch } from "vue";

const MIN_YEAR = 2000;

const { getWrapped } = useStatistic();

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const wrapped = ref<WrappedStat>();
const loading = ref(false);

const years = computed(() => {
    const list = [];
    for (let y = currentYear; y >= MIN_YEAR; y -= 1) {
        list.push(y);
    }
    return list;
});

const cardStyle = (index: number) => ({
    "--card-color": CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]
});

const load = async (): Promise<void> => {
    loading.value = true;
    try {
        wrapped.value = await getWrapped(selectedYear.value);
    } finally {
        loading.value = false;
    }
}

watch(selectedYear, load, { immediate: true });
</script>

<style scoped>
.wrapped-container {
    max-width: 900px;
}

.wrapped-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
}

.wrapped-title {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 26px;
}

.wrapped-year-select {
    max-width: 130px;
    flex-shrink: 0;
}

.wrapped-loading,
.wrapped-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 16px;
    color: rgb(var(--v-theme-on-surface-variant));
}

.wrapped-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
}

.wrapped-card {
    border-radius: 20px;
    padding: 24px 20px;
    background: color-mix(in srgb, var(--card-color) 14%, rgb(var(--v-theme-surface)));
    border: 1px solid color-mix(in srgb, var(--card-color) 30%, transparent);
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.wrapped-card--hero {
    grid-column: 1 / -1;
    min-height: 160px;
    align-items: center;
    text-align: center;
}

.wrapped-card-value {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 30px;
    color: var(--card-color);
    line-height: 1.15;
}

.wrapped-card--hero .wrapped-card-value {
    font-size: 40px;
}

.wrapped-card-value--text {
    font-size: 22px;
    overflow-wrap: break-word;
}

.wrapped-card-label {
    margin-top: 6px;
    font-size: 13.5px;
    color: rgb(var(--v-theme-on-surface-variant));
}
</style>
