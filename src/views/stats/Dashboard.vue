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
                <series-kinds :user-id="userId" @click="handleChartClick" />
            </v-col>
            <v-col cols="12" md="6">
                <seasons-platforms :user-id="userId" @click="handleChartClick" />
            </v-col>
            <v-col cols="12" md="6">
                <series-countries :user-id="userId" @click="handleChartClick" />
            </v-col>
            <v-col cols="12" md="6">
                <series-notes :user-id="userId" @click="handleChartClick" />
            </v-col>
        </template>
    </v-row>

    <base-modal v-model="modal" :max-width="800" @update:modelValue="handleClose">
        <template #title>
            <span v-if="modalTitle">{{ modalTitle }}</span>
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false"/>
        </template>
        <v-table>
            <tbody>
                <tr v-for="serie in series" :key="serie.id">
                    <td>
                        <router-link :text="serie.title" :to="`/${url}/${serie.id}`" />
                    </td>
                </tr>
            </tbody>
        </v-table>
    </base-modal>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseModal from "@/components/BaseModal.vue";
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
import SeriesNotes from "@/components/stats/SeriesNotes.vue";
import { useStatistic } from "@/composables/statistic";
import { ELEVATION, MAIN_COLOR } from "@/constants/style";
import type { ChartData, GlobalStat } from "@/models/stat";
import { computed, onBeforeMount, ref } from "vue";
import storageService from "@/services/storageService";
import BestMonths from "@/components/stats/BestMonths.vue";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ChartGroupedType, SerieStatus } from "@/types/types";
import { useSerieStore } from "@/stores/serie";
import type { Serie } from "@/models/serie";
import { useSerie } from "@/composables/serie";
import { CLOSE_ICON } from "@/constants/icons";

const props = defineProps({
    userId: { type: String, default: undefined },
    showBar: { type: Boolean, default: true }
});

const url = props.userId ? "discover" : "series";

const { getSeries } = useSerie();
const { getStats } = useStatistic();
const serieStore = useSerieStore();

const displayChart = ref(false);
const modal = ref(false);
const loading = ref(false);
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

const handleClose = () => {
    if (modal.value) return;
    serieStore.reset();
};

onBeforeMount(async () => {
    loading.value = true;
    displayChart.value = storageService.getDisplayChart();
    stat.value = await getStats(props.userId);
    loading.value = false;
});
</script>
