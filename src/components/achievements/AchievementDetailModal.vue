<template>
    <base-modal :model-value="!!achievement" :title="achievement?.name" :max-width="420"
        @update:model-value="$emit('close')">
        <div v-if="achievement" class="detail">
            <p class="detail-description">{{ ACHIEVEMENT_DESCRIPTIONS[achievement.code] }}</p>
            <p class="detail-value">Valeur actuelle : <strong>{{ formattedValue }} {{ unit }}</strong></p>

            <div class="tier-ladder">
                <div v-for="tier in tiers" :key="`${tier.league}-${tier.subTier}`" class="tier-row"
                    :class="{ 'tier-row--current': isCurrent(tier) }">
                    <span class="tier-league" :style="{ color: LEAGUE_COLORS[tier.league] }">
                        {{ LEAGUE_NAMES[tier.league] }} {{ SUB_TIER_ROMAN[tier.subTier] }}
                    </span>
                    <span class="tier-threshold">{{ tier.threshold }} {{ unit }}</span>
                    <v-icon v-if="isReached(tier)" :icon="CHECK_CIRCLE_ICON" size="16" color="success" />
                </div>
            </div>
        </div>
    </base-modal>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import type { Achievement, AchievementTier } from "@/models/achievement";
import { ACHIEVEMENT_DESCRIPTIONS, ACHIEVEMENT_UNITS, LEAGUE_COLORS, LEAGUE_NAMES, SUB_TIER_ROMAN } from "@/constants/achievements";
import { CHECK_CIRCLE_ICON } from "@/constants/icons";

const props = defineProps({
    achievement: { type: Object as PropType<Achievement | null>, default: null },
    tiers: { type: Array as PropType<AchievementTier[]>, default: () => [] }
});

defineEmits<{
    close: []
}>();

const unit = computed(() => props.achievement ? ACHIEVEMENT_UNITS[props.achievement.code] : "");

// watch_time is the only value that isn't already a whole number (minutes/60 on the backend).
const formattedValue = computed(() => props.achievement ? Math.round(props.achievement.value) : 0);

// A tier is reached once its threshold is crossed by the current value - true for every rung
// below (and including) the one actually unlocked, since evaluate() always jumps straight to
// the highest tier a value qualifies for rather than unlocking them one by one.
const isReached = (tier: AchievementTier): boolean =>
    !!props.achievement && props.achievement.value >= tier.threshold;

const isCurrent = (tier: AchievementTier): boolean =>
    !!props.achievement && props.achievement.league === tier.league && props.achievement.subTier === tier.subTier;
</script>

<style scoped>
.detail-description {
    color: rgb(var(--v-theme-on-surface-variant));
    font-size: 13.5px;
    margin-bottom: 8px;
}

.detail-value {
    font-size: 13.5px;
    margin-bottom: 18px;
}

.tier-ladder {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.tier-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 8px;
    font-size: 12.5px;
}

.tier-row--current {
    background: rgba(var(--v-theme-primary), 0.08);
}

.tier-league {
    flex: 1;
    font-weight: 700;
}

.tier-threshold {
    color: rgb(var(--v-theme-on-surface-variant));
}
</style>
