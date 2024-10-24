<template>
    <base-app-bar v-if="showBar" />

    <v-row v-if="stat" class="my-1">
        <v-col v-for="(obj, _, index) in cardsConfig" cols="12" md="6" :key="index">
            <v-card v-if="obj.display !== false" :elevation="ELEVATION" :prepend-icon="obj.icon">
                <template #title>{{ obj.name }}</template>
                <v-card-subtitle class="mb-2">
                    {{ obj.value }}
                </v-card-subtitle>
            </v-card>
        </v-col>
    </v-row>

    <v-expansion-panels v-if="userId" :elevation="ELEVATION" class="mb-2">
        <v-expansion-panel>
            <template #title>
                <span class="v-card-title pa-0">{{ sharedSeriesLabel }}</span>
            </template>
            <template #text>
                <v-table>
                    <tbody>
                        <tr v-for="serie in series" :key="serie.id">
                            <td><router-link :text="serie.title" :to="`/series/${serie.id}`" /></td>
                        </tr>
                    </tbody>
                </v-table>
            </template>
        </v-expansion-panel>
    </v-expansion-panels>


    <v-switch v-model="displayChart" color="black" label="Afficher les graphiques" @change="changeDisplayChart" />


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
            <v-col cols="12" md="6">
                <series-countries :user-id="userId" />
            </v-col>
            <v-col cols="12" md="6">
                <seasons-platforms :user-id="userId" />
            </v-col>
        </template>
    </v-row>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import EpisodesYears from "./EpisodesYears.vue";
import EpisodesMonthCurrentYear from "./EpisodesMonthCurrentYear.vue";
import SeasonsMonths from "./SeasonsMonths.vue";
import SeasonsMonthCurrentYear from "./SeasonsMonthCurrentYear.vue";
import SeasonsYears from "./SeasonsYears.vue";
import SeriesCountries from "./SeriesCountries.vue";
import SeriesKinds from "./SeriesKinds.vue";
import SeriesRankingTime from "./SeriesRankingTime.vue";
import TimeYears from "./TimeYears.vue";
import SeasonsPlatforms from "./SeasonsPlatforms.vue";
import { useStatistic } from "@/composables/statistic";
import { ELEVATION } from "@/constants/style";
import type { GlobalStat } from "@/models/stat";
import { computed, onBeforeMount, ref } from "vue";
import storageService from "@/services/storageService";
import BestMonths from "./BestMonths.vue";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import type { Serie } from "@/models/serie";
import { useSerie } from "@/composables/serie";
import { buildPlural } from "@/utils/format";

const props = defineProps({
    userId: { type: String, default: undefined },
    showBar: { type: Boolean, default: true }
});

const { getStats } = useStatistic();
const { getSeriesByStatus } = useSerie();

const displayChart = ref(false);
const loading = ref(false);
const series = ref<Serie[]>([]);
const stat = ref<GlobalStat>();

const sharedSeriesLabel = computed(() => `${buildPlural("série", series.value.length)} communes`);
const cardsConfig = computed(() => stat.value ? DashboardLayout(stat.value) : undefined);

const changeDisplayChart = () => {
    storageService.storeDisplayChart(displayChart.value);
}

const getSharedSeries = async () => {
    if (!props.userId) return;
    series.value = await getSeriesByStatus("shared", props.userId);
}

onBeforeMount(async () => {
    loading.value = true;
    displayChart.value = storageService.getDisplayChart();
    stat.value = await getStats(props.userId);
    await getSharedSeries();
    loading.value = false;
});
</script>
