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

    <friend-series v-if="userId" :user-id="userId" :type="SerieStatus.Shared" />

    <friend-series v-if="userId" :user-id="userId" :type="SerieStatus.Favorite" />

    <v-switch v-model="displayChart" :color="MAIN_COLOR" label="Afficher les graphiques" @change="changeDisplayChart" />

    <v-row>
        <template v-if="displayChart">
            <v-col cols="12" md="6">
                <chart :data="stat?.seasonsMonthCurrentYear" :type="ChartType.Bar" chart-id="seasons-months-curr-year"
                    default-color="#a84632" title="Saisons par mois cette année" />
            </v-col>
            <v-col cols="12" md="6">
                <chart :data="stat?.episodesMonthCurrentYear" :type="ChartType.Bar" chart-id="episodes-months-curr-year"
                    default-color="#1ae86c" title="Episodes par mois cette année" />
            </v-col>
            <v-col cols="12" md="6">
                <chart :data="stat?.timeYears" :type="ChartType.Line" chart-id="time-hours-years"
                    default-color="#2bccf0" title="Temps en heures par années" />
            </v-col>
            <v-col cols="12" md="6">
                <chart :data="stat?.seasonsYears" :type="ChartType.Bar" chart-id="seasons-years"
                    default-color="#1a20e8" title="Saisons par années" />
            </v-col>
            <v-col cols="12" md="6">
                <chart :data="stat?.episodesYears" :type="ChartType.Bar" chart-id="episodes-years"
                    default-color="#e81a70" title="Episodes par années" />
            </v-col>
            <v-col cols="12" md="6">
                <chart :data="stat?.seasonsMonths" :type="ChartType.Bar" chart-id="seasons-months"
                    default-color="#e81ac2" title="Saisons par mois" />
            </v-col>
            <v-col cols="12" md="6">
                <chart :data="stat?.bestMonths" :type="ChartType.Bar" chart-id="best-months"
                    default-color="#03fccf" title="Mois records en heures" />
            </v-col>
            <v-col cols="12" md="6">
                <chart :data="stat?.seriesRankingTime" :type="ChartType.Pie" chart-id="ranking-time" title="Séries les plus chronophages" />
            </v-col>
            <v-col cols="12" md="6">
                <series-kinds :data="stat?.seriesKinds" @click="handleChartClick" />
            </v-col>
            <v-col cols="12" md="6">
                <chart :data="stat?.seasonsPlatforms" :type="ChartType.Pie" chart-id="seasons-platforms" title="Saisons par plateformes" />
            </v-col>
            <v-col cols="12" md="6">
                <series-countries :data="stat?.seriesCountries" @click="handleChartClick" />
            </v-col>
            <v-col cols="12" md="6">
                <series-notes :data="stat?.seriesNotes" @click="handleChartClick" />
            </v-col>
        </template>
    </v-row>

    <base-modal v-model="modal" :max-width="800" :title="modalTitle">
        <series-link-list :series="series" :base-path="`/${url}`" @click="serieStore.reset()" />
    </base-modal>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseModal from "@/components/BaseModal.vue";
import SeriesLinkList from "@/components/series/SeriesLinkList.vue";
import SeriesCountries from "@/components/stats/SeriesCountries.vue";
import SeriesKinds from "@/components/stats/SeriesKinds.vue";
import FriendSeries from "@/components/friends/FriendSeries.vue";
import SeriesNotes from "@/components/stats/SeriesNotes.vue";
import { useStatistic } from "@/composables/statistic";
import { ELEVATION, MAIN_COLOR } from "@/constants/style";
import type { ChartData, GlobalStat } from "@/models/stat";
import { computed, onMounted, ref, watch } from "vue";
import storageService from "@/services/storageService";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ChartGroupedType, ChartType, SerieStatus } from "@/types/types";
import { useSerieStore } from "@/stores/serie";
import type { Serie } from "@/models/serie";
import { useSerie } from "@/composables/serie";
import { useScrollStore } from "@/stores/scroll";
import { useRoute } from "vue-router";
import Chart from "@/components/stats/Chart.vue";

const props = defineProps({
    userId: { type: String, default: undefined },
    showBar: { type: Boolean, default: true }
});

const url = props.userId ? "discover" : "series";

const route = useRoute();
const { getSeries } = useSerie();
const { getStats } = useStatistic();
const serieStore = useSerieStore();

const displayChart = ref(false);
const modal = ref(false);
const stat = ref<GlobalStat>();
const modalTitle = ref<string>();
const series = ref<Serie[]>([]);

const cardsConfig = computed(() => stat.value ? DashboardLayout(stat.value) : undefined);

const changeDisplayChart = () => {
    storageService.storeDisplayChart(displayChart.value);
}

const handleChartClick = async (data: ChartData) => {
    modalTitle.value = data.name;

    switch (data.kind) {
        case ChartGroupedType.Countries:
            serieStore.filterCountries = [data.name];
            modalTitle.value = `Séries du pays "${data.name}"`;
            break;
        case ChartGroupedType.Notes:
            serieStore.filterNotes = [{ id: data.id, name: data.name }];
            modalTitle.value = `Séries notées "${data.name}"`;
            break;
        case ChartGroupedType.Kinds:
            serieStore.filterKinds = [{ name: data.name, value: data.name }];
            modalTitle.value = `Séries du genre "${data.name}"`;
            break;
    }
    series.value = await getSeries();
    modal.value = true;
};

watch(modal, (value) => {
    if (!value) {
        serieStore.reset();
    }
});

onMounted(async () => {
    displayChart.value = storageService.getDisplayChart();
    stat.value = await getStats(props.userId);
    useScrollStore().scrollToPosition(route.fullPath);
});
</script>
