<template>
    <div class="serie-detail">
        <div v-if="serie.poster" class="preview-img">
            <base-image :src="serie.poster" />
        </div>
        <div class="detail-content">
            <div v-if="serie.kinds?.length" class="kinds-row">
                <span v-for="kind in serie.kinds" :key="kind" class="kind-tag">{{ kind }}</span>
            </div>

            <div class="status-badge" :class="serie.finished ? 'status-badge--done' : 'status-badge--ongoing'">
                <span class="status-dot"></span>
                {{ statusLabel }}
            </div>

            <div class="stat-strip">
                <div class="stat">
                    <div class="stat-value">{{ serie.seasons }}</div>
                    <div class="stat-label">Saisons</div>
                </div>
                <v-divider vertical thickness="1" opacity="0.4" />
                <div class="stat">
                    <div class="stat-value">{{ serie.episodes }}</div>
                    <div class="stat-label">Episodes</div>
                </div>
                <v-divider vertical thickness="1" opacity="0.4" />
                <div class="stat">
                    <div class="stat-value">{{ serie.duration }} min</div>
                    <div class="stat-label">Par épisode</div>
                </div>
                <v-divider vertical thickness="1" opacity="0.4" />
                <div class="stat">
                    <div class="stat-value">{{ totalDuration }}</div>
                    <div class="stat-label">Durée totale</div>
                </div>
            </div>

            <div class="meta-line">
                <template v-if="serie.network">
                    <span>{{ serie.network }}</span>
                    <span class="dot">•</span>
                </template>
                <span>{{ serie.country }}</span>
                <template v-if="serie.note">
                    <span class="dot">•</span>
                    <span class="meta-note">
                        <v-icon size="13" icon="mdi-star" color="secondary" />
                        {{ serie.note.toFixed(2) }} / 5
                    </span>
                </template>
                <template v-if="serie.creation">
                    <span class="dot">•</span>
                    <span>Depuis {{ serie.creation }}</span>
                </template>
            </div>

            <div v-if="serie.description" class="detail-section">
                <div class="section-label">Synopsis</div>
                <p class="section-text">{{ serie.description }}</p>
            </div>

            <div v-if="serie.platforms?.length" class="detail-section">
                <div class="section-label">Disponible sur</div>
                <div class="platforms-row">
                    <div v-for="plt in serie.platforms" :key="plt.id" class="platform-item">
                        <platform-card :platform="plt" />
                        <span class="platform-name">{{ plt.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BaseImage from "@/components/BaseImage.vue";
import PlatformCard from "@/components/series/PlatformCard.vue";
import { computed, type PropType } from "vue";
import type { Serie } from "@/models/serie";
import { minsToStringHoursDays } from "@/utils/format";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});

const statusLabel = computed(() => props.serie.finished ? "Terminée" : "En cours");
const totalDuration = computed(() => minsToStringHoursDays(props.serie.duration * (props.serie.episodes ?? 0)));
</script>

<style scoped>
.serie-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.preview-img {
    width: 180px;
    align-self: flex-start;

    @media screen and (max-width: 600px) {
        display: none;
    }
}

.detail-content {
    width: 100%;
}

.kinds-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.kind-tag {
    font-size: 11.5px;
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.12);
    border-radius: 999px;
    padding: 4px 10px;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: fit-content;
    padding: 5px 12px 5px 10px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 700;
    margin-bottom: 20px;
}

.status-badge--done {
    background: rgba(var(--v-theme-success), 0.12);
    color: rgb(var(--v-theme-success));
}

.status-badge--ongoing {
    background: rgba(var(--v-theme-info), 0.12);
    color: rgb(var(--v-theme-info));
}

.status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
}

.stat-strip {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    margin-bottom: 16px;
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 22px;
}

.stat:first-child {
    padding-left: 0;
}

.stat-value {
    font-family: "Space Grotesk", sans-serif;
    font-size: 21px;
    font-weight: 700;
}

.stat-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: rgb(var(--v-theme-on-surface-variant));
}

.meta-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgb(var(--v-theme-on-surface-variant));
    margin-bottom: 20px;
}

.meta-note {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.dot {
    opacity: 0.5;
}

.detail-section {
    margin-bottom: 20px;
}

.section-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgb(var(--v-theme-on-surface-variant));
    margin-bottom: 6px;
}

.section-text {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.6;
}

.platforms-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.platform-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    width: 60px;
}

.platform-name {
    font-size: 10.5px;
    color: rgb(var(--v-theme-on-surface-variant));
    text-align: center;
}
</style>
