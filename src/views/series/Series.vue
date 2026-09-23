<template>
    <base-app-bar auto-search placeholder="Chercher dans mes séries" search />
    <series-tabs class="mx-3 mt-4 mb-2" />
    <series-row ref="seriesRowRef" :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/series/SeriesRow.vue";
import SeriesTabs from "@/components/series/SeriesTabs.vue";
import type { Serie } from "@/models/serie";
import { nextTick, onMounted, ref } from "vue";
import { useSerie } from "@/composables/serie";
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useSerieStore } from "@/stores/serie";
import { useRoute } from "vue-router";
import { useScrollStore } from "@/stores/scroll";

const route = useRoute();
const scrollStore = useScrollStore();
const { getSeries } = useSerie();
const { filterCountries, filterKinds, filterPlatforms, filterTitle, filterNotes, filterFriends } = storeToRefs(useSerieStore());

const loading = ref(false);
const series = ref<Serie[]>([]);
const seriesRowRef = ref<InstanceType<typeof SeriesRow> | null>(null);

const fetchSeries = async (): Promise<void> => {
    loading.value = true;
    try {
        series.value = await getSeries();
    } finally {
        loading.value = false;
    }
}

watch([filterTitle, filterKinds, filterPlatforms, filterCountries, filterNotes, filterFriends], () => {
    fetchSeries().then();
});

onMounted(async () => {
    await fetchSeries();
    await nextTick();
    // The card grid is virtualized: a plain scrollTo would replay the saved
    // pixel offset against rows that were never actually measured, landing
    // short. Let the grid resolve it to the real row instead.
    const savedPosition = scrollStore.getScrollPosition(route.fullPath);
    if (savedPosition) {
        seriesRowRef.value?.restoreScroll(savedPosition);
    }
});
</script>