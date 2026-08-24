<template>
    <base-app-bar v-if="showBar" />

    <v-container fluid class="px-0 px-sm-4">
        <v-card v-if="cardsConfig" class="kpi-strip mb-6">
            <template v-for="(obj, index) in cardsConfig" :key="index">
                <div v-if="obj.display !== false" class="kpi-cell">
                    <stat-tile :label="obj.name" :value="obj.value" />
                </div>
            </template>
        </v-card>

        <friend-series v-if="userId" :user-id="userId" :type="SerieStatus.Shared" />

        <friend-series v-if="userId" :user-id="userId" :type="SerieStatus.Favorite" />

        <div class="dash-toolbar my-4 px-3 px-sm-0">
            <pill-tabs v-if="displayChart" v-model="tab" :tabs="DASHBOARD_TABS" />
            <span v-else class="text-body-2 text-medium-emphasis">Graphiques masqués</span>
            <v-switch v-model="displayChart" :color="MAIN_COLOR" density="compact" hide-details
                label="Graphiques" @change="changeDisplayChart" />
        </div>

        <v-window v-if="displayChart" v-model="tab">
            <v-window-item :value="1">
                <v-row>
                    <v-col v-if="stat?.episodesHeatmap?.length" cols="12">
                        <episodes-heatmap :data="stat.episodesHeatmap" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <chart :data="stat?.seasonsMonthCurrentYear" :type="ChartType.Bar"
                            chart-id="seasons-months-curr-year" :default-color="CATEGORICAL_COLORS[0]"
                            title="Saisons par mois cette année" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <chart :data="stat?.episodesMonthCurrentYear" :type="ChartType.Bar"
                            chart-id="episodes-months-curr-year" :default-color="CATEGORICAL_COLORS[1]"
                            title="Episodes par mois cette année" />
                    </v-col>
                </v-row>
            </v-window-item>

            <v-window-item :value="2">
                <v-row>
                    <v-col cols="12" md="6">
                        <chart :data="stat?.timeYears" :type="ChartType.Line" chart-id="time-hours-years"
                            :default-color="CATEGORICAL_COLORS[2]" title="Temps en heures par années" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <chart :data="stat?.seasonsYears" :type="ChartType.Bar" chart-id="seasons-years"
                            :default-color="CATEGORICAL_COLORS[3]" title="Saisons par années" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <chart :data="stat?.episodesYears" :type="ChartType.Bar" chart-id="episodes-years"
                            :default-color="CATEGORICAL_COLORS[4]" title="Episodes par années" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <chart :data="stat?.seasonsMonths" :type="ChartType.Bar" chart-id="seasons-months"
                            :default-color="CATEGORICAL_COLORS[5]" title="Saisons par mois" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <chart :data="stat?.bestMonths" :type="ChartType.Bar" chart-id="best-months"
                            :default-color="CATEGORICAL_COLORS[6]" title="Mois records en heures" />
                    </v-col>
                </v-row>
            </v-window-item>

            <v-window-item :value="3">
                <v-row>
                    <v-col cols="12" md="6">
                        <chart :data="stat?.seriesRankingTime" :type="ChartType.Pie" chart-id="ranking-time"
                            title="Séries les plus chronophages" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <series-kinds :data="stat?.seriesKinds" @click="handleChartClick" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <chart :data="stat?.seasonsPlatforms" :type="ChartType.Pie" chart-id="seasons-platforms"
                            title="Saisons par plateformes" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <series-notes :data="stat?.seriesNotes" @click="handleChartClick" />
                    </v-col>
                    <v-col cols="12">
                        <series-countries :data="stat?.seriesCountries" @click="handleChartClick" />
                    </v-col>
                </v-row>
            </v-window-item>
        </v-window>
    </v-container>

    <base-modal v-model="modal" :max-width="800" :title="modalTitle">
        <series-link-list :series="series" :base-path="`/${url}`" @click="serieStore.reset()" />
    </base-modal>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseModal from "@/components/BaseModal.vue";
import PillTabs from "@/components/PillTabs.vue";
import StatTile from "@/components/StatTile.vue";
import SeriesLinkList from "@/components/series/SeriesLinkList.vue";
import SeriesCountries from "@/components/stats/SeriesCountries.vue";
import SeriesKinds from "@/components/stats/SeriesKinds.vue";
import FriendSeries from "@/components/friends/FriendSeries.vue";
import SeriesNotes from "@/components/stats/SeriesNotes.vue";
import EpisodesHeatmap from "@/components/stats/EpisodesHeatmap.vue";
import { useStatistic } from "@/composables/statistic";
import { CATEGORICAL_COLORS, MAIN_COLOR } from "@/constants/style";
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

const DASHBOARD_TABS = [
    { value: 1, label: "Vue d'ensemble" },
    { value: 2, label: "Tendances" },
    { value: 3, label: "Répartition" },
];

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
const tab = ref(1);

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

<style scoped>
.kpi-strip {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 16px;
}

@media (min-width: 600px) {
    .kpi-strip {
        grid-template-columns: repeat(3, 1fr);
    }
}

.kpi-cell {
    padding: var(--sp-4, 16px) var(--sp-5, 20px);
    border-right: 1px solid rgb(var(--v-border-color));
}

.kpi-cell:nth-child(2n) {
    border-right: none;
}

@media (min-width: 600px) {
    .kpi-cell:nth-child(2n) {
        border-right: 1px solid rgb(var(--v-border-color));
    }

    .kpi-cell:nth-child(3n) {
        border-right: none;
    }
}

.kpi-cell:last-child {
    border-right: none;
}

.dash-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--sp-3, 12px);
}
</style>
