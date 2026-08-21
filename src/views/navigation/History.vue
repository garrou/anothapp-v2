<template>
    <base-app-bar />

    <v-container class="history-container">
        <v-select v-model="month" class="mb-4" style="max-width: 280px" :density="DENSITY" hide-details
            :items="MONTHS" item-title="text" item-value="value" @update:model-value="getHistory" />

        <v-timeline density="compact" line-thickness="2" side="end">
            <v-timeline-item v-for="(season, index) in timeline" :key="index" size="small">
                <div class="history-item">
                    <div class="history-item-head">
                        <router-link class="history-item-title" :text="season.showTitle"
                            :to="`/series/${season.showId}`" />
                        <span v-if="season.addedAt" class="history-item-date">{{ formatDate(season.addedAt) }}</span>
                    </div>
                    <div class="history-item-body">
                        <season-card :serieLink="`/series/${season.showId}`" :season="season.season" />
                        <platform-card :platform="getSpecificPlatform(season.platformId)" />
                    </div>
                </div>
            </v-timeline-item>
        </v-timeline>
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeasonCard from "@/components/seasons/SeasonCard.vue";
import { useSearch } from "@/composables/search";
import { useSeason } from "@/composables/season";
import { DENSITY } from "@/constants/style";
import type { SeasonTimeline } from "@/models/season";
import type { Platform } from "@/models/serie";
import { formatDate } from "@/utils/format";
import { onBeforeMount } from "vue";
import { ref } from "vue";
import PlatformCard from "@/components/series/PlatformCard.vue";

const MONTHS = [
    {
        text: "Ce mois",
        value: 0,
    },
    {
        text: "Depuis un mois",
        value: 1,
    },
    {
        text: "Depuis 2 mois",
        value: 2
    },
    {
        text: "Depuis 3 mois",
        value: 3
    },
    {
        text: "Depuis 6 mois",
        value: 6
    },
    {
        text: "Depuis 1 an",
        value: 12
    }
];

const { getPlatforms } = useSearch();
const { getSeasonsTimeline } = useSeason();

const month = ref(0);
const timeline = ref<SeasonTimeline[]>([]);
const platforms = ref<Platform[]>([]);

const getHistory = async () => {
    timeline.value = await getSeasonsTimeline(month.value);
}

const getAllPlatforms = async () => {
    platforms.value = await getPlatforms();
}

const getSpecificPlatform = (id?: number): Platform | undefined => platforms.value.find((p) => p.id === id);

onBeforeMount(async () => {
    await Promise.all([
        getAllPlatforms(),
        getHistory()
    ]);
})
</script>

<style scoped>
.history-container {
    max-width: 720px;
}

.history-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 4px;
}

.history-item-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 4px 12px;
}

.history-item-title {
    font-weight: 700;
}

.history-item-date {
    font-size: 12.5px;
    color: rgb(var(--v-theme-on-surface-variant));
    white-space: nowrap;
}

.history-item-body {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}
</style>