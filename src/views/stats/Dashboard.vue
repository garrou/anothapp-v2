<template>
    <base-app-bar v-if="showBar" />

    <v-container fluid class="px-0 px-sm-4">
        <router-link v-if="!userId" to="/wrapped" class="wrapped-cta mb-6">
            <v-icon icon="mdi-party-popper" class="me-2" />
            Découvrir votre année en séries
        </router-link>

        <v-card v-if="cardsConfig" class="kpi-strip mb-6">
            <template v-for="(obj, index) in cardsConfig" :key="index">
                <div v-if="obj.display !== false" class="kpi-cell">
                    <stat-tile :icon="obj.icon" :label="obj.name" :value="obj.value" />
                </div>
            </template>
        </v-card>

        <pill-tabs v-if="userId" v-model="sectionTab" class="mb-4" :tabs="sectionTabs" />

        <v-window v-model="sectionTab" :touch="false">
            <v-window-item v-if="userId" :value="SECTION_SERIES">
                <friend-series :user-id="userId" :type="SerieStatus.All" />
                <friend-series :user-id="userId" :type="SerieStatus.Shared" />
                <friend-series :user-id="userId" :type="SerieStatus.Favorite" />
                <friend-platforms :user-id="userId" />
                <friend-favorite-actors :user-id="userId" />
            </v-window-item>

            <v-window-item :value="SECTION_STATS">
                <pill-tabs v-model="tab" class="mb-4" :tabs="DASHBOARD_TABS" />

                <v-window v-model="tab" :touch="false">
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
                                <chart :data="stat?.topWatchedWithFriends" :type="ChartType.Pie" chart-id="top-watched-with"
                                    title="Vu le plus avec" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <series-notes :data="stat?.seriesNotes" @click="handleChartClick" />
                            </v-col>
                            <v-col cols="12">
                                <series-countries :data="stat?.seriesCountries" @click="handleChartClick" />
                            </v-col>
                        </v-row>
                    </v-window-item>

                    <v-window-item v-if="!userId" :value="TAB_ACHIEVEMENTS">
                        <badges-grid />
                    </v-window-item>
                </v-window>
            </v-window-item>

            <v-window-item v-if="userId" :value="SECTION_ACHIEVEMENTS">
                <badges-grid :user-id="userId" />
            </v-window-item>

            <v-window-item v-if="userId" :value="SECTION_PLAYLISTS">
                <card-grid v-if="playlists.length" :items="playlists" :loading="playlistsLoading" :sm="6" :md="4"
                    :lg="3">
                    <template #default="{ item: playlist }">
                        <v-card class="playlist-card" :to="`/playlists/${playlist.id}`">
                            <playlist-cover :posters="playlist.posters ?? []" />
                            <v-card-title>{{ playlist.name }}</v-card-title>
                            <v-card-subtitle class="pb-4">
                                {{ buildPlural("série", playlist.showsCount ?? 0) }}
                            </v-card-subtitle>
                        </v-card>
                    </template>
                </card-grid>
                <empty-state v-else-if="!playlistsLoading" :icon="PLAYLIST_PLAY_ICON" title="Aucune playlist"
                    description="Cet(te) ami(e) n'a pas encore de playlist visible." />
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
import CardGrid from "@/components/CardGrid.vue";
import EmptyState from "@/components/EmptyState.vue";
import PillTabs from "@/components/PillTabs.vue";
import PlaylistCover from "@/components/playlists/PlaylistCover.vue";
import StatTile from "@/components/StatTile.vue";
import SeriesLinkList from "@/components/series/SeriesLinkList.vue";
import SeriesCountries from "@/components/stats/SeriesCountries.vue";
import SeriesKinds from "@/components/stats/SeriesKinds.vue";
import FriendSeries from "@/components/friends/FriendSeries.vue";
import FriendPlatforms from "@/components/friends/FriendPlatforms.vue";
import FriendFavoriteActors from "@/components/friends/FriendFavoriteActors.vue";
import SeriesNotes from "@/components/stats/SeriesNotes.vue";
import EpisodesHeatmap from "@/components/stats/EpisodesHeatmap.vue";
import { useStatistic } from "@/composables/statistic";
import { usePlaylist } from "@/composables/playlist";
import { CATEGORICAL_COLORS } from "@/constants/style";
import type { ChartData, GlobalStat } from "@/models/stat";
import type { Playlist } from "@/models/playlist";
import { computed, onMounted, ref, watch, type PropType } from "vue";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ChartGroupedType, ChartType, SerieStatus } from "@/types/types";
import { useSerieStore } from "@/stores/serie";
import type { Serie } from "@/models/serie";
import { useSerie } from "@/composables/serie";
import { useScrollStore } from "@/stores/scroll";
import { buildPlural } from "@/utils/format";
import { useRoute } from "vue-router";
import Chart from "@/components/stats/Chart.vue";
import BadgesGrid from "@/components/achievements/BadgesGrid.vue";
import { PLAYLIST_PLAY_ICON } from "@/constants/icons";

const SECTION_SERIES = 1;
const SECTION_STATS = 2;
const SECTION_PLAYLISTS = 3;
const SECTION_ACHIEVEMENTS = 4;
const TAB_ACHIEVEMENTS = 4;

const props = defineProps({
    userId: { type: String, default: undefined },
    showBar: { type: Boolean, default: true },
    preloadedStat: { type: Object as PropType<Promise<GlobalStat>>, default: undefined }
});

// A friend's achievements get their own top-level tab (next to Playlists, unlocked-only);
// your own dashboard has no such tab, so its full badge grid lives here instead.
const DASHBOARD_TABS = computed(() => [
    { value: 1, label: "En cours" },
    { value: 2, label: "Tendances" },
    { value: 3, label: "Répartition" },
    ...(props.userId ? [] : [{ value: TAB_ACHIEVEMENTS, label: "Succès" }]),
]);

const url = props.userId ? "discover" : "series";

const route = useRoute();
const { getSeries } = useSerie();
const { getStats } = useStatistic();
const { getPlaylists } = usePlaylist();
const serieStore = useSerieStore();

const modal = ref(false);
const stat = ref<GlobalStat>();
const modalTitle = ref<string>();
const series = ref<Serie[]>([]);
const tab = ref(1);
const playlists = ref<Playlist[]>([]);
const playlistsLoading = ref(false);
const sectionTab = ref(props.userId ? SECTION_SERIES : SECTION_STATS);

const cardsConfig = computed(() => stat.value ? DashboardLayout(stat.value) : undefined);
const sectionTabs = computed(() => [
    { value: SECTION_SERIES, label: "Séries" },
    { value: SECTION_STATS, label: "Stats" },
    { value: SECTION_PLAYLISTS, label: "Playlists" },
    { value: SECTION_ACHIEVEMENTS, label: "Succès" }
]);

const loadPlaylists = async (): Promise<void> => {
    playlistsLoading.value = true;
    try {
        playlists.value = await getPlaylists(props.userId);
    } catch {
    } finally {
        playlistsLoading.value = false;
    }
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

// Reads live off the route (not just at setup) - clicking an achievement notification
// while already on /dashboard navigates to the same route record, which Vue Router
// reuses rather than remounting, so a one-shot ref() read here would miss it.
watch(() => route.query.tab, (value) => {
    if (value === "achievements") {
        tab.value = TAB_ACHIEVEMENTS;
    }
}, { immediate: true });

onMounted(async () => {
    if (props.userId) loadPlaylists();
    stat.value = await (props.preloadedStat ?? getStats(props.userId));
    useScrollStore().scrollToPosition(route.fullPath);
});
</script>

<style scoped>
.wrapped-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 20px;
    border-radius: 14px;
    background: rgba(var(--v-theme-primary), 0.1);
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
}

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

.playlist-card {
    height: 100%;
}
</style>
