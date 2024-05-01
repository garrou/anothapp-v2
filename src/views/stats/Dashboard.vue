<template>
    <base-app-bar v-if="showBar" />
    <v-container>
        <v-row v-if="stat" class="mb-2">
            <v-col v-for="(obj, _, index) in cardsConfig" cols="12" md="6" :key="index">
                <v-card v-if="obj.value !== undefined" :elevation="ELEVATION" :prepend-icon="obj.icon">
                    <template #title>{{ obj.title }}</template>
                    <v-card-subtitle class="mb-2">
                        {{ obj.value }}
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-switch v-model="displayChart" color="black" label="Afficher les graphiques"
                    @change="changeDisplayChart" />
        </v-row>

        <v-row>
            <template v-if="displayChart">
                <v-col cols="12" md="6">
                    <seasons-month-current-year :user-id="userId" />
                </v-col>
                <v-col cols="12" md="6">
                    <episodes-month-current-year :user-id="userId" />
                </v-col>
                <v-col cols="12" md="6">
                    <time-years :user-id="userId" />
                </v-col>
                <v-col cols="12" md="6">
                    <seasons-years :user-id="userId" />
                </v-col>
                <v-col cols="12" md="6">
                    <episodes-years :user-id="userId" />
                </v-col>
                <v-col cols="12" md="6">
                    <seasons-months :user-id="userId" />
                </v-col>
                <v-col cols="12" md="6">
                    <best-months :user-id="userId" />
                </v-col>
                <v-col cols="12" md="6">
                    <series-ranking-time :user-id="userId" />
                </v-col>
                <v-col cols="12" md="6">
                    <series-kinds :user-id="userId" />
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import EpisodesYears from "./EpisodesYears.vue";
import EpisodesMonthCurrentYear from "./EpisodesMonthCurrentYear.vue";
import SeasonsMonths from "./SeasonsMonths.vue";
import SeasonsMonthCurrentYear from "./SeasonsMonthCurrentYear.vue";
import SeasonsYears from "./SeasonsYears.vue";
import SeriesKinds from "./SeriesKinds.vue";
import SeriesRankingTime from "./SeriesRankingTime.vue";
import TimeYears from "./TimeYears.vue";
import { useStatistic } from "@/composables/statistic";
import { ELEVATION } from "@/constants/style";
import type { GlobalStat } from "@/models/stat";
import { minsToStringHoursDays } from "@/utils/format";
import { computed, onBeforeMount, ref } from "vue";
import { PLAY_ICON } from "@/constants/icons";
import storageService from "@/services/storageService";
import BestMonths from "./BestMonths.vue";

const props = defineProps({
    userId: { type: String, default: undefined },
    showBar: { type: Boolean, default: true }
});

const { getStats } = useStatistic();

const displayChart = ref(false);
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
        "icon": PLAY_ICON,
        "title": "Séries",
        "value": stat.value?.nbSeries
    },
    {
        "icon": PLAY_ICON,
        "title": "Saisons",
        "value": stat.value?.nbSeasons
    },
    {
        "icon": PLAY_ICON,
        "title": "Episodes",
        "value": stat.value?.nbEpisodes,
    },
    {
        "icon": "mdi-crown",
        "title": "Record",
        "value": stat.value?.bestMonth ? `${stat.value?.bestMonth[0].label} : ${minsToStringHoursDays(stat.value?.bestMonth[0].value)}` : 0
    }
]);

const changeDisplayChart = () => {
    storageService.storeDisplayChart(displayChart.value);
}

onBeforeMount(async () => {
    displayChart.value = storageService.getDisplayChart();
    stat.value = await getStats(props.userId);
});
</script>