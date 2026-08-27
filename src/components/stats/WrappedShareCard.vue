<template>
    <div ref="cardRef" class="share-card">
        <div class="share-card-brand">
            <span aria-hidden="true">🎉</span>
            <span>Anothapp Wrapped</span>
        </div>

        <div class="share-card-year">{{ year }}</div>

        <div class="share-card-hero">
            <div class="share-card-hero-value">{{ minsToStringHoursDays(wrapped.totalTime) }}</div>
            <div class="share-card-hero-label">de visionnage</div>
        </div>

        <div class="share-card-stats">
            <div class="share-card-stat">
                <div class="share-card-stat-value">{{ wrapped.totalEpisodes }}</div>
                <div class="share-card-stat-label">épisodes vus</div>
            </div>
            <div class="share-card-stat">
                <div class="share-card-stat-value">{{ wrapped.nbNewShows }}</div>
                <div class="share-card-stat-label">
                    {{ wrapped.nbNewShows > 1 ? "nouvelles séries" : "nouvelle série" }}
                </div>
            </div>
        </div>

        <div class="share-card-highlights">
            <div v-if="wrapped.topShow" class="share-card-highlight">
                <span class="share-card-highlight-label">Série de l'année</span>
                <span class="share-card-highlight-value">{{ wrapped.topShow.label }}</span>
            </div>
            <div v-if="wrapped.topKind" class="share-card-highlight">
                <span class="share-card-highlight-label">Genre préféré</span>
                <span class="share-card-highlight-value">{{ wrapped.topKind.label }}</span>
            </div>
            <div v-if="wrapped.topPlatform" class="share-card-highlight">
                <span class="share-card-highlight-label">Plateforme préférée</span>
                <span class="share-card-highlight-value">{{ wrapped.topPlatform.label }}</span>
            </div>
            <div v-if="wrapped.bestMonth" class="share-card-highlight">
                <span class="share-card-highlight-label">Mois le plus actif</span>
                <span class="share-card-highlight-value">{{ wrapped.bestMonth.label.trim() }}</span>
            </div>
            <div v-if="wrapped.bestStreak" class="share-card-highlight">
                <span class="share-card-highlight-label">Record de jours d'affilée</span>
                <span class="share-card-highlight-value share-card-highlight-value--streak">
                    <span aria-hidden="true">🔥</span>
                    {{ wrapped.bestStreak }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toPng } from "html-to-image";
import type { WrappedStat } from "@/models/stat";
import { minsToStringHoursDays } from "@/utils/format";
import { ref, type PropType } from "vue";

defineProps({
    wrapped: { type: Object as PropType<WrappedStat>, required: true },
    year: { type: Number, required: true }
});

const cardRef = ref<HTMLElement>();

const capture = async (): Promise<string> => {
    if (!cardRef.value) throw new Error("Impossible de générer l'image");
    return toPng(cardRef.value, { pixelRatio: 3, skipFonts: true });
}

defineExpose({ capture });
</script>

<style scoped>
.share-card {
    width: 320px;
    aspect-ratio: 9 / 16;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    background: linear-gradient(160deg, #5646b8 0%, #6c5ce0 55%, #e87ba4 100%);
    color: white;
    font-family: "Space Grotesk", sans-serif;
    box-sizing: border-box;
}

.share-card-brand {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    opacity: 0.85;
}

.share-card-year {
    margin-top: 4px;
    font-size: 22px;
    font-weight: 700;
}

.share-card-hero {
    margin-top: 32px;
    text-align: center;
}

.share-card-hero-value {
    font-size: 40px;
    font-weight: 700;
    line-height: 1.1;
}

.share-card-hero-label {
    margin-top: 4px;
    font-size: 14px;
    opacity: 0.85;
}

.share-card-stats {
    margin-top: 28px;
    display: flex;
    justify-content: center;
    gap: 40px;
}

.share-card-stat {
    text-align: center;
}

.share-card-stat-value {
    font-size: 24px;
    font-weight: 700;
}

.share-card-stat-label {
    margin-top: 2px;
    font-size: 12px;
    opacity: 0.85;
}

.share-card-highlights {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.share-card-highlight {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.share-card-highlight-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.75;
}

.share-card-highlight-value {
    margin-top: 2px;
    font-size: 16px;
    font-weight: 700;
    overflow-wrap: break-word;
}

.share-card-highlight-value--streak {
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>
