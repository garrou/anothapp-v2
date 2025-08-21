<template>
    <base-app-bar discover placeholder="Ajouter une série" search />
    <series-row :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/series/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onMounted, ref, watch } from "vue";
import { useSearch } from "@/composables/search";
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/stores/search";
import { useRoute } from "vue-router";
import { useScrollStore } from "@/stores/scroll";

const route = useRoute();
const scrollStore = useScrollStore();
const { getSeries } = useSearch();
const { filterKinds, filterLimit, filterPlatforms, filterTitle } = storeToRefs(useSearchStore());

const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (): Promise<void> => {
    loading.value = true;
    series.value = await getSeries();
    loading.value = false;
}

watch([filterTitle, filterKinds, filterPlatforms, filterLimit], () => {
    fetchSeries().then();
});

onMounted(async () => {
    await fetchSeries();
    scrollStore.scrollToPosition(route.fullPath);
});
</script>