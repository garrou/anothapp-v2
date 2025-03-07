<template>
    <base-app-bar v-if="showBar" />

    <v-row v-if="stat" class="my-1">
        <v-col v-for="(obj, index) in cardsConfig" cols="12" md="6" :key="index">
            <v-card v-if="obj.display !== false" :elevation="ELEVATION" :prepend-icon="obj.icon">
                <template #title>{{ obj.name }}</template>
                <v-card-subtitle class="mb-2">
                    {{ obj.value }}
                </v-card-subtitle>
            </v-card>
        </v-col>
    </v-row>

    <friend-series v-if="userId" :user-id="userId" type="shared" />

    <friend-series v-if="userId" :user-id="userId" type="favorite" />

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
                <seasons-platforms :user-id="userId" />
            </v-col>
            <v-col cols="12">
                <series-countries :user-id="userId" />
            </v-col>
        </template>
    </v-row>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import EpisodesYears from "@/components/stats/EpisodesYears.vue";
import EpisodesMonthCurrentYear from "@/components/stats/EpisodesMonthCurrentYear.vue";
import SeasonsMonths from "@/components/stats/SeasonsMonths.vue";
import SeasonsMonthCurrentYear from "@/components/stats/SeasonsMonthCurrentYear.vue";
import SeasonsYears from "@/components/stats/SeasonsYears.vue";
import SeriesCountries from "@/components/stats/SeriesCountries.vue";
import SeriesKinds from "@/components/stats/SeriesKinds.vue";
import SeriesRankingTime from "@/components/stats/SeriesRankingTime.vue";
import TimeYears from "@/components/stats/TimeYears.vue";
import SeasonsPlatforms from "@/components/stats/SeasonsPlatforms.vue";
import FriendSeries from "@/components/friends/FriendSeries.vue";
import { useStatistic } from "@/composables/statistic";
import { ELEVATION } from "@/constants/style";
import type { GlobalStat } from "@/models/stat";
import { computed, onBeforeMount, ref } from "vue";
import storageService from "@/services/storageService";
import BestMonths from "@/components/stats/BestMonths.vue";
import { DashboardLayout } from "@/layouts/dashboard-layout";

const props = defineProps({
    userId: { type: String, default: undefined },
    showBar: { type: Boolean, default: true }
});

const { getStats } = useStatistic();

const displayChart = ref(false);
const loading = ref(false);
const stat = ref<GlobalStat>();

const cardsConfig = computed(() => stat.value ? DashboardLayout(stat.value) : undefined);

const changeDisplayChart = () => {
    storageService.storeDisplayChart(displayChart.value);
}

onBeforeMount(async () => {
    loading.value = true;
    displayChart.value = storageService.getDisplayChart();
    stat.value = await getStats(props.userId);
    loading.value = false;
});
</script>
