<template>
    <base-app-bar />

    <v-container class="wrapped-container">
        <div class="wrapped-header">
            <h1 class="wrapped-title">Votre année {{ selectedYear }}</h1>
            <div class="wrapped-header-actions">
                <v-btn v-if="wrapped?.totalTime" :icon="SHARE_ICON" variant="tonal" :color="MAIN_COLOR" size="40"
                    @click="shareModal = true" />
                <v-select v-model="selectedYear" class="wrapped-year-select" :items="years" density="compact"
                    hide-details variant="outlined" />
            </div>
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

                <div v-if="wrapped.bestStreak" class="wrapped-card" :style="cardStyle(7)">
                    <v-icon icon="mdi-fire" size="20" class="wrapped-card-icon" />
                    <div class="wrapped-card-value">{{ wrapped.bestStreak }}</div>
                    <div class="wrapped-card-label">
                        {{ wrapped.bestStreak > 1 ? "jours d'affilée (record)" : "jour d'affilée (record)" }}
                    </div>
                </div>
            </div>
        </template>
    </v-container>

    <base-modal v-model="shareModal" title="Partager votre année" :max-width="420">
        <div class="share-preview">
            <wrapped-share-card v-if="wrapped" ref="shareCardRef" :wrapped="wrapped" :year="selectedYear" />
        </div>
        <div class="share-actions">
            <v-btn block color="primary" rounded="pill" :loading="sharing" @click="share">Partager</v-btn>
            <v-btn block variant="outlined" rounded="pill" :loading="downloading" @click="download">Télécharger</v-btn>
        </div>
    </base-modal>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseModal from "@/components/BaseModal.vue";
import WrappedShareCard from "@/components/stats/WrappedShareCard.vue";
import { useStatistic } from "@/composables/statistic";
import { useSnackbar } from "@/composables/snackbar";
import type { WrappedStat } from "@/models/stat";
import { CATEGORICAL_COLORS, MAIN_COLOR } from "@/constants/style";
import { SHARE_ICON } from "@/constants/icons";
import { minsToStringHoursDays } from "@/utils/format";
import { computed, ref, watch } from "vue";

const MIN_YEAR = 2000;

const { getWrapped } = useStatistic();
const { showError } = useSnackbar();

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const wrapped = ref<WrappedStat>();
const loading = ref(false);
const shareModal = ref(false);
const sharing = ref(false);
const downloading = ref(false);
const shareCardRef = ref<InstanceType<typeof WrappedShareCard>>();

const years = computed(() => {
    const list = [];
    for (let y = currentYear; y >= MIN_YEAR; y -= 1) {
        list.push(y);
    }
    return list;
});

const cardStyle = (index: number) => ({
    "--card-color": CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length],
    "--delay": `${index * 60}ms`
});

const load = async (): Promise<void> => {
    loading.value = true;
    try {
        wrapped.value = await getWrapped(selectedYear.value);
    } finally {
        loading.value = false;
    }
}

const triggerDownload = (dataUrl: string): void => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `wrapped-${selectedYear.value}.png`;
    link.click();
}

const captureImage = async (): Promise<{ dataUrl: string; file: File }> => {
    if (!shareCardRef.value) throw new Error("Impossible de générer l'image");
    const dataUrl = await shareCardRef.value.capture();
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `wrapped-${selectedYear.value}.png`, { type: "image/png" });
    return { dataUrl, file };
}

const share = async (): Promise<void> => {
    sharing.value = true;
    try {
        const { dataUrl, file } = await captureImage();

        if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: `Mon année ${selectedYear.value} en séries` });
        } else {
            triggerDownload(dataUrl);
        }
    } catch (e) {
        if ((e as Error).name !== "AbortError") {
            showError("Impossible de partager l'image");
        }
    } finally {
        sharing.value = false;
    }
}

const download = async (): Promise<void> => {
    downloading.value = true;
    try {
        const { dataUrl } = await captureImage();
        triggerDownload(dataUrl);
    } catch {
        showError("Impossible de générer l'image");
    } finally {
        downloading.value = false;
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

.wrapped-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
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
    opacity: 0;
    animation: wrapped-card-in 0.5s ease-out forwards;
    animation-delay: var(--delay, 0ms);
}

.wrapped-card--hero {
    grid-column: 1 / -1;
    min-height: 160px;
    align-items: center;
    text-align: center;
    background: linear-gradient(160deg, #2a1f6b 0%, #6c5ce0 55%, #e87ba4 100%);
    border: none;
}

.wrapped-card-icon {
    color: var(--card-color);
    margin-bottom: 6px;
}

.wrapped-card-value {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 30px;
    color: var(--card-color);
    line-height: 1.15;
}

.wrapped-card--hero .wrapped-card-value {
    font-size: 42px;
    color: white;
}

.wrapped-card--hero .wrapped-card-label {
    color: rgba(255, 255, 255, 0.85);
}

@keyframes wrapped-card-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wrapped-card {
        opacity: 1;
        animation: none;
    }
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

.share-preview {
    display: flex;
    justify-content: center;
    padding: 16px 0;
}

.share-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 8px;
}
</style>
