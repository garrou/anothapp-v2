<template>
    <div v-if="loading" class="achievements-loading">
        <v-progress-circular color="primary" indeterminate />
    </div>

    <template v-else>
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
                    :achievement="achievement" @click="selectAchievement(achievement.code)" />
            </div>
        </v-card>
    </template>

    <achievement-detail-modal :achievement="selectedAchievement" :tiers="selectedTiers"
        @close="selectedCode = null" />
</template>

<script lang="ts" setup>
import EmptyState from "@/components/EmptyState.vue";
import BadgeMedallion from "@/components/achievements/BadgeMedallion.vue";
import AchievementDetailModal from "@/components/achievements/AchievementDetailModal.vue";
import { useAchievement } from "@/composables/achievement";
import { LEAGUE_COLORS, LEAGUE_NAMES } from "@/constants/achievements";
import { ACHIEVEMENT_ICON } from "@/constants/icons";
import type { Achievement, AchievementTier } from "@/models/achievement";
import { computed, onBeforeMount, ref } from "vue";

const LEAGUES = [1, 2, 3, 4, 5, 6, 7];

const props = defineProps({
    userId: { type: String, default: undefined }
});

const { getAchievements, getTiers } = useAchievement();

const loading = ref(true);
const achievements = ref<Achievement[]>([]);
const tierCatalog = ref<Record<string, AchievementTier[]>>({});
const selectedCode = ref<string | null>(null);

const selectedAchievement = computed(() =>
    achievements.value.find((achievement) => achievement.code === selectedCode.value) ?? null);

const selectedTiers = computed(() => selectedCode.value ? tierCatalog.value[selectedCode.value] ?? [] : []);

let tiersLoaded = false;

const selectAchievement = async (code: string) => {
    selectedCode.value = code;

    if (tiersLoaded) return;
    tiersLoaded = true;
    try {
        tierCatalog.value = await getTiers();
    } catch {
        tiersLoaded = false;
    }
};

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
