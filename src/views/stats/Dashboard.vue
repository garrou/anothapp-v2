<template>
    <base-app-bar />
    <v-container>
        <v-row v-if="stat" class="mb-2">
            <v-col v-for="(obj, _, index) in cardsConfig" cols="12" md="6" :key="index">
                <v-card :elevation="ELEVATION" :prepend-icon="obj.icon">
                    <template #title>{{ obj.title }}</template>
                    <v-card-subtitle v-if="obj.value" class="mb-2">
                        {{ obj.value }}
                    </v-card-subtitle>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <seasons-month-current-year />
            </v-col>
            <v-col cols="12" md="6">
                <episodes-month-current-year />
            </v-col>
            <v-col cols="12" md="6">
                <time-years />
            </v-col>
            <v-col cols="12" md="6">
                <seasons-years />
            </v-col>
            <v-col cols="12" md="6">
                <episodes-years />
            </v-col>
            <v-col cols="12" md="6">
                <seasons-months />
            </v-col>
            <v-col cols="12" md="6">
                <series-ranking-time />
            </v-col>
            <v-col cols="12" md="6">
                <series-kinds />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from '@/components/BaseAppBar.vue';
import EpisodesYears from './EpisodesYears.vue';
import EpisodesMonthCurrentYear from './EpisodesMonthCurrentYear.vue';
import SeasonsMonths from './SeasonsMonths.vue';
import SeasonsMonthCurrentYear from './SeasonsMonthCurrentYear.vue';
import SeasonsYears from './SeasonsYears.vue';
import SeriesKinds from './SeriesKinds.vue';
import SeriesRankingTime from './SeriesRankingTime.vue';
import TimeYears from './TimeYears.vue';
import { useStatistic } from '@/composables/statistic';
import { ELEVATION } from '@/constants/style';
import type { GlobalStat } from '@/models/stat';
import { minsToStringHoursDays } from '@/utils/format';
import { computed, onBeforeMount, ref } from 'vue';

const { getStats } = useStatistic();

const stat = ref<GlobalStat>();

const cardsConfig = computed(() => [
    {
        "icon": "mdi-timer-sand",
        "title": "Ce mois",
        "value": minsToStringHoursDays(stat.value?.monthTime)
    },
    {
        "icon": "mdi-timer-sand-complete",
        "title": "Temps total",
        "value": minsToStringHoursDays(stat.value?.totalTime)
    },
    {
        "icon": "mdi-play",
        "title": "Séries",
        "value": stat.value?.nbSeries
    },
    {
        "icon": "mdi-play",
        "title": "Saisons",
        "value": stat.value?.nbSeasons
    },
    {
        "icon": "mdi-play",
        "title": "Episodes",
        "value": stat.value?.nbEpisodes,
    },
    {
        "icon": "mdi-crown",
        "title": "Record",
        "value": `${stat.value?.bestMonth.date} : ${minsToStringHoursDays(stat.value?.bestMonth.time)}`
    }
]);

onBeforeMount(async () => {
    stat.value = await getStats();
});
</script>