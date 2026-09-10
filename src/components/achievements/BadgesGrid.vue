<template>
    <div v-if="loading" class="achievements-loading">
        <v-progress-circular color="primary" indeterminate />
    </div>

    <template v-else>
        <div v-if="subtitle" class="achievements-subtitle text-body-2 text-medium-emphasis">{{ subtitle }}</div>

        <v-card class="legend-card">
            <div v-for="league in LEAGUES" :key="league" class="legend-item">
                <span class="legend-dot" :style="{ background: LEAGUE_COLORS[league] }" />
                {{ LEAGUE_NAMES[league] }}
            </div>
        </v-card>

        <empty-state v-if="!achievements.length" :icon="ACHIEVEMENT_ICON" title="Aucun succès débloqué"
            description="Rien à afficher pour l'instant." />

        <v-card v-else class="badges-card">
            <div class="badges-grid">
                <badge-medallion v-for="achievement in achievements" :key="achievement.code"
                    :achievement="achievement" />
            </div>
        </v-card>
    </template>
</template>

<script lang="ts" setup>
import EmptyState from "@/components/EmptyState.vue";
import BadgeMedallion from "@/components/achievements/BadgeMedallion.vue";
import { useAchievement } from "@/composables/achievement";
import { LEAGUE_COLORS, LEAGUE_NAMES } from "@/constants/achievements";
import { ACHIEVEMENT_ICON } from "@/constants/icons";
import type { Achievement } from "@/models/achievement";
import { buildPlural } from "@/utils/format";
import { computed, onBeforeMount, ref } from "vue";

const LEAGUES = [1, 2, 3, 4, 5, 6, 7];

const props = defineProps({
    userId: { type: String, default: undefined }
});

const { getAchievements } = useAchievement();

const loading = ref(true);
const achievements = ref<Achievement[]>([]);

const unlockedCount = computed(() => achievements.value.filter((a) => a.league !== null).length);
const lockedCount = computed(() => achievements.value.length - unlockedCount.value);

// Locked/progress counts only make sense for your own full list - a friend's
// response only ever contains what they've already unlocked.
const subtitle = computed(() => props.userId
    ? ""
    : `${buildPlural("succès débloqué", unlockedCount.value)} · ${buildPlural("verrouillé", lockedCount.value)}`);

onBeforeMount(async () => {
    loading.value = true;
    try {
        achievements.value = await getAchievements(props.userId);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.achievements-loading {
    display: flex;
    justify-content: center;
    padding: 64px 0;
}

.achievements-subtitle {
    margin-bottom: 12px;
}

.legend-card {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 14px 18px;
    margin-bottom: 20px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 700;
}

.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.badges-card {
    padding: 28px;
}

.badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 26px 16px;
}
</style>
