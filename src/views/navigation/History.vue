<template>
    <base-app-bar />

    <v-container>
        <v-select v-model="month" :density="DENSITY" :items="MONTHS" item-title="text" item-value="value"
            @update:model-value="getHistory" />
        <v-timeline>
            <v-timeline-item v-for="(season, index) in timeline" :key="index">
                <template v-slot:opposite>
                    <router-link :text="season.showTitle" :to="`/series/${season.showId}`" />
                    <p v-if="season.addedAt">{{ formatDate(season.addedAt) }}</p>
                </template>
                <div class="d-flex ga-4 align-start">
                    <season-card :serieLink="`/series/${season.showId}`" :season="season.season" />
                    <platform-card :platform="getSpecificPlatform(season.platformId)" />
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