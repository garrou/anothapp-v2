<template>
    <base-app-bar auto-search placeholder="Chercher dans mes séries" search />
    <series-row :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/series/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onMounted, ref } from "vue";
import { useSerie } from "@/composables/serie";
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useSerieStore } from "@/stores/serie";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useScrollStore } from "@/stores/scroll";

const route = useRoute();
const scrollStore = useScrollStore();
const { getSeries } = useSerie();
const { filterCountries, filterKinds, filterPlatforms, filterTitle, filterNotes } = storeToRefs(useSerieStore());

const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (): Promise<void> => {
    loading.value = true;
    series.value = await getSeries();
    loading.value = false;
}

watch([filterTitle, filterKinds, filterPlatforms, filterCountries, filterNotes], () => {
    fetchSeries().then();
});

onBeforeRouteLeave((to, from, next) => {
    scrollStore.positions[route.fullPath] = window.scrollY;
    next();
});

onMounted(async () => {
    await fetchSeries();
    const scrollY = scrollStore.positions[route.fullPath];
    if (scrollY) {
        window.scrollTo(0, scrollY);
    }
});
</script>