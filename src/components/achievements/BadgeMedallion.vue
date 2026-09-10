<template>
    <div class="badge" :style="{ '--tier': tierColor }">
        <div class="badge-stage">
            <div v-if="showGlow" class="badge-glow" />
            <div class="badge-ring-wrap">
                <svg class="ring" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="42" class="ring-track" stroke-width="6" />
                    <circle cx="48" cy="48" r="42" class="ring-value" stroke-width="6" stroke-linecap="round"
                        :stroke-dasharray="CIRCUMFERENCE" :stroke-dashoffset="ringOffset"
                        transform="rotate(-90 48 48)" />
                </svg>
                <div class="badge-disc" :class="{ 'badge-disc--locked': !reached }">
                    <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round" v-html="iconMarkup" />
                </div>
                <div v-if="reached" class="badge-chip badge-chip--roman">{{ subTierRoman }}</div>
                <div v-else class="badge-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V7a4 4 0 018 0v4" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="badge-name">{{ achievement.name }}</div>
        <div class="badge-caption" :class="{ 'badge-caption--reached': reached }">{{ caption }}</div>
    </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import type { Achievement } from "@/models/achievement";
import { ACHIEVEMENT_ICONS, LEAGUE_COLORS, LEAGUE_NAMES, SUB_TIER_ROMAN, TOP_LEAGUE } from "@/constants/achievements";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const props = defineProps({
    achievement: { type: Object as PropType<Achievement>, required: true }
});

const reached = computed(() => props.achievement.league !== null);

// Colored by the league actually reached once there is one, so the caption's league
// name always matches its own color; only an unreached badge borrows the color of
// the league its progress ring is climbing toward.
const tierColor = computed(() =>
    LEAGUE_COLORS[props.achievement.league ?? props.achievement.nextLeague ?? 1]);

const showGlow = computed(() => props.achievement.league === TOP_LEAGUE);

const ringOffset = computed(() => CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, props.achievement.progress))));

const subTierRoman = computed(() =>
    props.achievement.subTier !== null ? SUB_TIER_ROMAN[props.achievement.subTier] : "");

const caption = computed(() => props.achievement.league !== null
    ? LEAGUE_NAMES[props.achievement.league]
    : "Verrouillé");

const iconMarkup = computed(() => ACHIEVEMENT_ICONS[props.achievement.code] ?? "");
</script>

<style scoped>
.badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
}

.badge-stage {
    position: relative;
    width: 96px;
    height: 96px;
}

.badge-glow {
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--tier) 0%, transparent 70%);
    opacity: .32;
    filter: blur(9px);
}

.badge-ring-wrap {
    position: absolute;
    inset: 0;
}

.ring {
    position: absolute;
    inset: 0;
}

.ring-track {
    fill: none;
    stroke: rgb(var(--v-theme-surface-variant));
}

.ring-value {
    fill: none;
    stroke: var(--tier);
    transition: stroke-dashoffset .4s ease;
}

.badge-disc {
    position: absolute;
    inset: 13px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--tier) 16%, rgb(var(--v-theme-surface)));
}

.badge-disc--locked {
    background: rgb(var(--v-theme-surface-variant));
}

.badge-icon {
    width: 32px;
    height: 32px;
    color: var(--tier);
}

.badge-disc--locked .badge-icon {
    color: rgb(var(--v-theme-on-surface-variant));
    opacity: .55;
}

.badge-chip {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgb(var(--v-border-color));
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(var(--v-theme-on-surface-variant));
}

.badge-chip svg {
    width: 12px;
    height: 12px;
}

.badge-chip--roman {
    font-family: "Space Grotesk", sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: var(--tier);
}

.badge-name {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 12.5px;
    text-align: center;
    line-height: 1.25;
}

.badge-caption {
    font-size: 11px;
    font-weight: 600;
    color: rgb(var(--v-theme-on-surface-variant));
    text-align: center;
}

.badge-caption--reached {
    color: var(--tier);
}
</style>
